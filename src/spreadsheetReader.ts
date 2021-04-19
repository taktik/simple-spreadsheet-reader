import { httpclient } from 'typescript-http-client'
import { search } from 'jmespath'
import { groupBy } from 'lodash'
import Request = httpclient.Request

export type SpredsheedCell = {
	cell: string,
	value: string
	rows: number,
	coll: string,
	collNb: number
}

export type GoogleJsonSpreadsheet = { [key: string]: any }

/**
 * A simple reader for a Google spreadsheet publish on web.
 */
export class SpreadsheetReader {
	protected spreadsheetsId?: string
	protected httpClient: httpclient.HttpClient
	protected _xmlError?: string
	protected _rawJson?: GoogleJsonSpreadsheet
	protected _cellsList?: Array<SpredsheedCell>
	protected _maxRaw?: number
	protected _maxColl?: string

	/**
	 * XML string of the error message
	 */
	get xmlError(): string | undefined {
		return this._xmlError
	}

	/**
	 * get raw JSON loaded from google spreadsheet
	 */
	get rawJson(): GoogleJsonSpreadsheet {
		if(this._rawJson) {
			return this._rawJson
		}
		throw Error('No data, loadRawJson first')
	}

	/**
	 * List od cells loaded from google spreadsheet
	 */
	get cellsList(): Array<SpredsheedCell> {
		if(this._cellsList) {
			return this._cellsList
		}
		throw Error('No data, loadRawJson first')
	}

	/**
	 * get the number of raw used in the spreadsheet
	 */
	get maxRaw(): number {
		if(this._maxRaw) {
			return this._maxRaw
		}
		throw Error('No data, loadRawJson first')
	}

	/**
	 * get the number of column used in the spreadsheet.
	 */
	get maxColl(): string {
		if(this._maxColl) {
			return this._maxColl
		}
		throw Error('No data, loadRawJson first')
	}

	constructor(spreadsheetsUrlOrId: string) {
		this.httpClient = httpclient.newHttpClient()
		try {
			const url = new URL(spreadsheetsUrlOrId)
			const parsed = /spreadsheets\/\w\/(.*)\//.exec(url.pathname)
			if(parsed) {
				this.spreadsheetsId = parsed[1]
			}
		} catch (e) {
			this.spreadsheetsId = spreadsheetsUrlOrId
		}
	}

	protected processSpreadsheets(rawResponce: GoogleJsonSpreadsheet | string): GoogleJsonSpreadsheet {
		let rawJson: GoogleJsonSpreadsheet
		if( typeof rawResponce === 'string') {
			rawJson = JSON.parse(rawResponce)
		} else {
			rawJson = rawResponce
		}

		this._cellsList = search(rawJson, `feed.entry[*].{cell: title."$t", value: content."$t"}`)
			.map(elem => {
				const parcedCell = /([A-Z]+)([0-9]+)/.exec(elem.cell)
				if(parcedCell === null) throw Error('Error in spredsheet format')
				const [cellId, coll, rows] = parcedCell
				return Object.assign({ rows: Number(rows), coll, cellId, collNb: coll.charCodeAt(0) }, elem)
			})
		this._rawJson = rawJson
		this._maxRaw = Number(search(this.cellsList, 'max_by([*], &rows).rows'))
		this._maxColl = String.fromCharCode(search(this.cellsList, 'max_by([*], &collNb).collNb'))
		return this._rawJson
	}

	/**
	 * Load spreadsheet data
	 */
	async loadSpreadsheetData(): Promise<GoogleJsonSpreadsheet> {
		try {
			if( ! this.spreadsheetsId ) {
				throw Error('Invalid spreadsheetsIs')
			}
			const url = `https://spreadsheets.google.com/feeds/cells/${this.spreadsheetsId}/1/public/full?alt=json`
			const request = new Request(url, { method: 'GET', responseType: 'text'})

			return this.processSpreadsheets(await this.httpClient.execute(request))
		} catch (error) {
			const requestError: httpclient.Response<any> = error
			this._xmlError = requestError.body || error.message
			throw Error('Unable to load spreadsheets. For more info see xmlError attribute')
		}
	}

	/**
	 * get value of a cell
	 * @param cellId
	 */
	getCellValue(cellId: string): string | undefined{
		return search(this.rawJson, `feed.entry[*].{cell: title."$t", value: content."$t"}[?cell=='${cellId.toUpperCase()}'].value`)[0]
	}

	/**
	 * gel all lines of the spreadsheet in an array of array
	 */
	getAllLines(): Array<Array<string | undefined>>{
		const cellsByRaws = groupBy(this.cellsList, (cell) => cell.rows)
		const results: Array<Array<string | undefined>> = []
		for(const i of SpreadsheetReader.numberGenerator(this.maxRaw)){
			results.push( SpreadsheetReader.formatColl(cellsByRaws[i] || [], this.maxColl))
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
	getTable(): Node{
		if( this._xmlError) {
			const template = document.createElement('template');
			template.innerHTML = this._xmlError.trim()

			if (template.content && template.content.firstChild)
				return template.content
			throw Error('Unknow Error')
		}

		const table = this.generateTable(this.maxRaw, this.maxColl)
		this.cellsList.forEach(cell => {
			const cellContain = document.createTextNode(cell.value || '')
			const cellElem = table.querySelector(`#ssr-${cell.cell}`)
			cellElem?.append(cellContain)
		})
		return table
	}

	protected static formatColl(cells: Array<SpredsheedCell>, maxColl: string): Array<string | undefined>{
		const cellsByColl = groupBy(cells, (cell) => cell.coll)
		const results: Array<string> = []
		for(const  i of SpreadsheetReader.lettersGenerator(maxColl)){
			const cell: any = (cellsByColl[i] || [{ value: undefined}])[0]
			results.push(cell.value)
		}
		return results
	}

	protected static * lettersGenerator(maxLetters: string): Generator<string> {
		for(let  i=65; i <= maxLetters.charCodeAt(0); i++){
			yield String.fromCharCode(i)
		}
	}

	protected static * numberGenerator(maxLines = 100): Generator<number> {
		for(let  i=1; i <= maxLines; i++){
			yield i
		}
	}

	protected createHeadCell(cellContaint: string | undefined): HTMLTableDataCellElement {
		const cell = document.createElement('td');
		cell.classList.add('ssr-cell-head')
		cell.appendChild(document.createTextNode(cellContaint || ''));
		return cell
	}

	protected generateTable(maxRaw: number, maxCell: string): HTMLTableElement {
		const table = document.createElement('table');
		table.classList.add('ssr-table')

		const tableHead = document.createElement('thead');
		const rowHead = document.createElement('tr');
		rowHead.appendChild(this.createHeadCell(''));
		Array.from(SpreadsheetReader.lettersGenerator(maxCell)).forEach((collId) => {
			rowHead.appendChild(this.createHeadCell(collId));
		});
		tableHead.appendChild(rowHead);
		table.appendChild(tableHead);

		const tableBody = document.createElement('tbody');
		Array.from(SpreadsheetReader.numberGenerator(maxRaw)).forEach((rowId) => {
			const row = document.createElement('tr');
			row.appendChild(this.createHeadCell(`${rowId}`));
			Array.from(SpreadsheetReader.lettersGenerator(maxCell)).forEach((collId) => {
				const cell = document.createElement('td');
				const cellId = collId + rowId
				cell.id = `ssr-${cellId}`
				cell.setAttribute('cell-id', cellId)
				cell.classList.add('ssr-cell-data')
				row.appendChild(cell);
			});

			tableBody.appendChild(row);
		});
		table.appendChild(tableBody);
		return table
	}
}

