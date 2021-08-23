import { httpclient } from 'typescript-http-client'
import { search } from 'jmespath'
import { groupBy, flatten } from 'lodash'
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
	values: Array<Array<string>>
}

type ICell = { cell: string; value: string }

type IParsedCells = Array<ICell>

export type SpredsheedCell = {
	cell: string
	value: string
	rows: string
	coll: string
	collNb: number
}

interface ISheetsData {
	parsedCells?: IParsedCells
	cellsList?: Array<SpredsheedCell>
	maxRow?: number
	maxColl?: string
}

const key = 'AIzaSyCrLUwWIUoJ3Ut46zgs6hyfytURyro9uuY'

/**
 * A simple reader for a Google spreadsheet publish on web.
 */
export class SpreadsheetReader {
	private sheetsProperties?: ISheetsProperties
	private _currentPage = 0
	private sheetsData: ISheetsData[] = []
	protected spreadsheetsId?: string
	protected httpClient: httpclient.HttpClient
	protected _xmlError?: string

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

	constructor(spreadsheetsUrlOrId: string) {
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

	protected processSpreadsheet(parsedCells: IParsedCells): ISheetsData {
		const cellsList = parsedCells.map((elem) => {
			const parcedCell = /([A-Z]+)([0-9]+)/.exec(elem.cell)
			if (parcedCell === null) throw Error('Error in spredsheet format')
			const [cellId, coll, rows] = parcedCell
			return Object.assign({ rows, coll, cellId, collNb: coll.charCodeAt(0) }, elem)
		})
		const maxRow = Number(search(cellsList, 'max_by([*], &rows).rows'))
		const maxColl = String.fromCharCode(search(cellsList, 'max_by([*], &collNb).collNb'))
		return { cellsList, parsedCells, maxRow, maxColl }
	}

	private getColumnLettersFromIndex(index: number): string {
		// After the letter Z (index 25), the letter go back again from AA, AB, AC, ...
		if (index >= 26) {
			const firstLetterIndex = Math.floor(index / 25) - 1
			return `${this.getColumnLettersFromIndex(firstLetterIndex)}${this.getColumnLettersFromIndex(
				index % 26
			)}`
		}
		return String.fromCharCode(index + 65)
	}

	private parseSheetValues(sheetValues: ISheetValue): ISheetsData {
		const parsedValues: IParsedCells = flatten(
			sheetValues.values.map((row, rowIndex) =>
				row.map((cellValue, columnIndex) => ({
					cell: `${this.getColumnLettersFromIndex(columnIndex)}${rowIndex + 1}`,
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
			const sheetPropertiesUrl = `https://sheets.googleapis.com/v4/spreadsheets/${this.spreadsheetsId}?key=${key}`
			const sheetPropertiesRequest = new Request(sheetPropertiesUrl, {
				method: 'GET',
				contentType: 'application/json',
			})
			this.sheetsProperties = await this.httpClient.execute<ISheetsProperties>(
				sheetPropertiesRequest
			)

			if (this.sheetsProperties) {
				this.sheetsData = await Promise.all(
					this.sheetsProperties.sheets.map(async ({ properties: { title } }) => {
						const valuesUrl = `https://sheets.googleapis.com/v4/spreadsheets/${this.spreadsheetsId}/values/${title}?key=${key}`
						const valuesRequest = new Request(valuesUrl, {
							method: 'GET',
							contentType: 'application/json',
						})
						const values = await this.httpClient.execute<ISheetValue>(valuesRequest)
						return this.parseSheetValues(values)
					})
				)
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
	 * gel all lines of the spreadsheet in an array of array
	 */
	getAllLines(): Array<Array<string | undefined>> {
		const cellsByRaws = groupBy(this.cellsList, (cell) => cell.rows)
		const results: Array<Array<string | undefined>> = []
		for (const i of SpreadsheetReader.numberGenerator(this.maxRow)) {
			results.push(SpreadsheetReader.formatColl(cellsByRaws[i] || [], this.maxColl))
		}
		return results
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

	protected static formatColl(
		cells: Array<SpredsheedCell>,
		maxColl: string
	): Array<string | undefined> {
		const cellsByColl = groupBy(cells, (cell) => cell.coll)
		const results: Array<string> = []
		for (const i of SpreadsheetReader.lettersGenerator(maxColl)) {
			const cell: any = (cellsByColl[i] || [{ value: undefined }])[0]
			results.push(cell.value)
		}
		return results
	}

	protected static *lettersGenerator(maxLetters: string): Generator<string> {
		for (let i = 65; i <= maxLetters.charCodeAt(0); i++) {
			yield String.fromCharCode(i)
		}
	}

	protected static *numberGenerator(maxLines = 100): Generator<number> {
		for (let i = 1; i <= maxLines; i++) {
			yield i
		}
	}

	protected createHeadCell(cellContaint: string | undefined): HTMLTableDataCellElement {
		const cell = document.createElement('td')
		cell.classList.add('ssr-cell-head')
		cell.appendChild(document.createTextNode(cellContaint || ''))
		return cell
	}

	protected generateTable(maxRow: number, maxCell: string): HTMLTableElement {
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
