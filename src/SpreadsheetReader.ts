import { httpclient } from 'typescript-http-client'
import { flatten } from 'lodash'
import Request = httpclient.Request

interface IRGBColors {
	red: number
	green: number
	blue: number
}

interface ISheetsProperties {
	properties: {
		autoRecalc: string
		defaultFormat: {
			backgroundColor: IRGBColors
			backgroundColorStyle: IRGBColors
			padding: { bottom: number; top: number; right: number; left: number }
			textFormat: {
				bold: boolean
				fontFamily: string
				fontSize: number
				foregroundColor?: IRGBColors
				foregroundColorStyle: { rgbColor?: IRGBColors }
				static: boolean
				strikethrough: boolean
				underline: boolean
			}
			verticalAlignment: string
			wrapStrategy: string
		}
		locale: string
		spreadsheetTheme: {
			primaryFontFamily: string
			themeColors: Array<{
				colorType: string
				color: { rgbColor?: IRGBColors }
			}>
		}
		timeZone: string
		title: string
	}
	sheets: Array<{
		properties: {
			gridProperties: { rowCount: number; columnCount: number }
			index: number
			sheetId: number
			sheetType: string
			title: string
		}
	}>
	spreadsheetId: string
	spreadsheetUrl: string
}

interface ISheetValue {
	majorDimension: string
	range: string
	values?: Array<Array<string>>
}

type ICell = { cell: string; value: string }

type IParsedCells = Array<ICell>

export type SpredsheedCell = {
	cell: string
	value: string
	rows: string
	coll: string
}

interface ISheetsData {
	parsedCells?: IParsedCells
	cellsList?: Array<SpredsheedCell>
	maxRow?: number
	maxColl?: string
}

/**
 * A simple reader for a Google spreadsheet publish on web.
 */
export class SpreadsheetReader {
	private readonly apiKey: string
	private sheetsProperties?: ISheetsProperties
	private _currentPage = 0
	private sheetsData: ISheetsData[] = []
	private readonly spreadsheetsId?: string
	private httpClient: httpclient.HttpClient
	private _xmlError?: string

	/**
	 * gets the current page, indexed at 0
	 */
	get currentPage(): number {
		return this._currentPage
	}
	/**
	 * sets the current page, indexed at 0
	 */
	set currentPage(page: number) {
		if (page >= 0 && page < this.numberOfPages) {
			this._currentPage = page
		} else {
			throw Error(`The new page value should be included in [0;${this.numberOfPages}[`)
		}
	}

	/**
	 * get the total number of pages the sheet has
	 */
	get numberOfPages(): number {
		if (this.sheetsData.length > 0) {
			return this.sheetsData.length
		}
		throw Error('No data, call loadSpreadsheetData first')
	}

	/**
	 * XML string of the error message
	 */
	get xmlError(): string | undefined {
		return this._xmlError
	}

	/**
	 * get parsed cells
	 */
	get parsedCells(): IParsedCells {
		const parsedCells = this.sheetsData[this.currentPage].parsedCells
		if (parsedCells) {
			return parsedCells
		}
		throw Error('No data, call loadSpreadsheetData first')
	}

	/**
	 * List od cells loaded from google spreadsheet
	 */
	get cellsList(): Array<SpredsheedCell> {
		const cellsList = this.sheetsData[this.currentPage].cellsList
		if (cellsList) {
			return cellsList
		}
		throw Error('No data, call loadSpreadsheetData first')
	}

	/**
	 * get the number of raw used in the spreadsheet
	 */
	get maxRow(): number {
		const maxRow = this.sheetsData[this.currentPage].maxRow
		if (maxRow) {
			return maxRow
		}
		throw Error('No data, call loadSpreadsheetData first')
	}

	/**
	 * get the number of column used in the spreadsheet.
	 */
	get maxColl(): string {
		const maxColl = this.sheetsData[this.currentPage].maxColl
		if (maxColl) {
			return maxColl
		}
		throw Error('No data, call loadSpreadsheetData first')
	}

	constructor(spreadsheetsUrlOrId: string, apiKey: string) {
		this.apiKey = apiKey
		this.httpClient = httpclient.newHttpClient()
		try {
			const url = new URL(spreadsheetsUrlOrId)
			const parsed = /spreadsheets\/\w\/(.*)\//.exec(url.pathname)
			if (parsed) {
				this.spreadsheetsId = parsed[1]
			}
		} catch (e) {
			this.spreadsheetsId = spreadsheetsUrlOrId
		}
	}

	private processSpreadsheet(parsedCells: IParsedCells): ISheetsData {
		const cellsList = parsedCells.map((elem) => {
			const parcedCell = /([A-Z]+)([0-9]+)/.exec(elem.cell)
			if (parcedCell === null) throw Error('Error in spredsheet format')
			const [cellId, coll, rows] = parcedCell
			return { rows, coll, cellId, ...elem }
		})
		const maxRow = cellsList.reduce((highestRow, nextValue) => {
			const currentRow = Number(nextValue.rows)
			if (currentRow > highestRow) {
				return currentRow
			}
			return highestRow
		}, 0)
		const maxColl = cellsList.reduce((highestColl, { coll }) => {
			// parseInt(coll, 36) parses the letters as a number, which can then be compared to each other to define which is the "highest" column letter
			if (parseInt(coll, 36) > parseInt(highestColl, 36)) {
				return coll
			}
			return highestColl
		}, 'A')
		return { cellsList, parsedCells, maxRow, maxColl }
	}

	private static getColumnLettersFromIndex(index: number): string {
		// After the letter Z (index >= 26), the letter go back again from AA, AB, AC, ...
		if (index >= 26) {
			const firstLetterIndex = Math.floor(index / 26) - 1
			const secondLetterIndex = index % 26
			return `${this.getColumnLettersFromIndex(firstLetterIndex)}${this.getColumnLettersFromIndex(
				secondLetterIndex
			)}`
		}
		return String.fromCharCode(index + 65)
	}

	/*
	 * Function to parse the array we receive from google API into an array of objects containing the cell name alongside the cell value
	 * [["cellValue1", "cellValue2"]] => [{cell: "A1", value: "cellValue1"}, {cell: "B2", value: "cellValue2"}]
	 * This function is made to process results from a request using majorDimension=ROWS (default value for majorDimension on the get/value request)
	 * If the request is made with another value for majorDimension, this function will break
	 */
	private parseSheetValues(sheetValues: Array<Array<string>>): ISheetsData {
		const parsedValues: IParsedCells = flatten(
			sheetValues.map((row, rowIndex) =>
				row.map((cellValue, columnIndex) => ({
					cell: `${SpreadsheetReader.getColumnLettersFromIndex(columnIndex)}${rowIndex + 1}`,
					value: cellValue,
				}))
			)
		)
		return this.processSpreadsheet(parsedValues)
	}

	/**
	 * Load spreadsheet cells values
	 */
	async loadSpreadsheetData(): Promise<void> {
		try {
			const sheetPropertiesUrl = `https://sheets.googleapis.com/v4/spreadsheets/${this.spreadsheetsId}?key=${this.apiKey}`
			const sheetPropertiesRequest = new Request(sheetPropertiesUrl, {
				method: 'GET',
				contentType: 'application/json',
			})
			// We are interested in the sheetsProperties.sheets to know the number of sheets and their names as it is
			// necessary for the next request on /v4/spreadsheets/{sheetId}/values/{sheetName}
			this.sheetsProperties = await this.httpClient.execute<ISheetsProperties>(
				sheetPropertiesRequest
			)

			if (this.sheetsProperties) {
				const sheets = await Promise.all(
					this.sheetsProperties.sheets.map(async ({ properties: { title } }) => {
						// The function parseSheetValues is made to parse the format majorDimension=ROWS, if that value changes, the function will break.
						// https://developers.google.com/sheets/api/reference/rest/v4/spreadsheets.values/get
						const valuesUrl = `https://sheets.googleapis.com/v4/spreadsheets/${this.spreadsheetsId}/values/${title}?majorDimension=ROWS&key=${this.apiKey}`
						const valuesRequest = new Request(valuesUrl, {
							method: 'GET',
							contentType: 'application/json',
						})

						const sheet = await this.httpClient.execute<ISheetValue>(valuesRequest)
						// If sheet.value doesnt exists it means the sheet is empty, we should not display it.
						// We can't know before we fetch the sheets data, so the promise will resolve to undefined and we filter
						// that out after.
						if (!sheet.values) {
							return undefined
						}
						return this.parseSheetValues(sheet.values)
					})
				)
				this.sheetsData = sheets.filter((sheet): sheet is ISheetsData => sheet !== undefined)
			}
		} catch (error) {
			const requestError: httpclient.Response<any> = error
			this._xmlError = requestError.body || error.message
			throw Error('Unable to load spreadsheets. For more info see xmlError attribute')
		}
	}

	/**
	 * get value of a cell
	 * @param cellId
	 * @param page
	 */
	getCellValue(cellId: string, page = 0): string | undefined {
		this.currentPage = page
		const matchingCell = this.parsedCells.find(({ cell }) => cell === cellId)
		if (matchingCell) {
			return matchingCell.value
		}
	}

	/**
	 * Compute Node elements of the table.
	 * In case of errors the node will contains the error message.
	 *
	 * *classes*
	 * - ssr-table: class of the root elements of the table
	 * - ssr-cell-head: class of header cells
	 * - ssr-cell-data: class of cells contains data
	 *
	 * *id*
	 * - All data Element have id="ssr-${cellID}"
	 *
	 * *results HTML*
	 *
	 * ```html
	 * <table class="ssr-table">
			<thead>
			<tr>
				<td class="ssr-cell-head"></td>
				<td class="ssr-cell-head">A</td>
				<td class="ssr-cell-head">B</td>
			</tr>
			</thead>
			<tbody>
			<tr>
				<td class="ssr-cell-head">1</td>
				<td cell-id="A1" id="ssr-A1" class="ssr-cell-data">text</td>
				<td cell-id="B1" id="ssr-B1" class="ssr-cell-data">value</td>
			</tr>
			<tr>
				<td class="ssr-cell-head">2</td>
				<td cell-id="A2" id="ssr-A2" class="ssr-cell-data"></td>
				<td cell-id="B2" id="ssr-B2" class="ssr-cell-data">other</td>
			</tr>
			</tbody>
		</table>
	```
	 *
	 * <table class="ssr-table">
			<thead>
			<tr>
				<td class="ssr-cell-head"></td>
				<td class="ssr-cell-head">A</td>
				<td class="ssr-cell-head">B</td>
			</tr>
			</thead>
			<tbody>
			<tr>
				<td class="ssr-cell-head">1</td>
				<td cell-id="A1" id="ssr-A1" class="ssr-cell-data">text</td>
				<td cell-id="B1" id="ssr-B1" class="ssr-cell-data">value</td>
			</tr>
			<tr>
				<td class="ssr-cell-head">2</td>
				<td cell-id="A2" id="ssr-A2" class="ssr-cell-data"></td>
				<td cell-id="B2" id="ssr-B2" class="ssr-cell-data">other</td>
			</tr>
			</tbody>
		</table>
	 */
	getTable(): Node {
		if (this._xmlError) {
			const template = document.createElement('template')
			template.innerHTML = this._xmlError.trim()

			if (template.content && template.content.firstChild) return template.content.firstChild
			throw Error('Unknow Error')
		}

		const table = this.generateTable(this.maxRow, this.maxColl)
		this.cellsList.forEach((cell) => {
			const cellContain = document.createTextNode(cell.value || '')
			const cellElem = table.querySelector(`#ssr-${cell.cell}`)
			cellElem?.append(cellContain)
		})
		return table
	}

	private static *lettersGenerator(maxLetters: string): Generator<string> {
		let currentLetters = ''
		let index = 0
		while (maxLetters !== currentLetters) {
			currentLetters = SpreadsheetReader.getColumnLettersFromIndex(index)
			yield currentLetters
			index++
		}
	}

	private static *numberGenerator(maxLines = 100): Generator<number> {
		for (let i = 1; i <= maxLines; i++) {
			yield i
		}
	}

	private createHeadCell(cellContaint: string | undefined): HTMLTableDataCellElement {
		const cell = document.createElement('td')
		cell.classList.add('ssr-cell-head')
		cell.appendChild(document.createTextNode(cellContaint || ''))
		return cell
	}

	private generateTable(maxRow: number, maxCell: string): HTMLTableElement {
		const table = document.createElement('table')
		table.classList.add('ssr-table')

		const tableHead = document.createElement('thead')
		const rowHead = document.createElement('tr')
		rowHead.appendChild(this.createHeadCell(''))
		Array.from(SpreadsheetReader.lettersGenerator(maxCell)).forEach((collId) => {
			rowHead.appendChild(this.createHeadCell(collId))
		})
		tableHead.appendChild(rowHead)
		table.appendChild(tableHead)

		const tableBody = document.createElement('tbody')
		Array.from(SpreadsheetReader.numberGenerator(maxRow)).forEach((rowId) => {
			const row = document.createElement('tr')
			row.appendChild(this.createHeadCell(`${rowId}`))
			Array.from(SpreadsheetReader.lettersGenerator(maxCell)).forEach((collId) => {
				const cell = document.createElement('td')
				const cellId = collId + rowId
				cell.id = `ssr-${cellId}`
				cell.setAttribute('cell-id', cellId)
				cell.classList.add('ssr-cell-data')
				row.appendChild(cell)
			})

			tableBody.appendChild(row)
		})
		table.appendChild(tableBody)
		return table
	}
}
