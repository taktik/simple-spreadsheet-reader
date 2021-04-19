import { expect } from 'chai'
import sinon, { SinonFakeServer } from 'sinon'
import sampleData from './data.json'
import { template } from 'lodash'
import { SpreadsheetReader } from '../src/spreadsheetReader'
import { expectedTable } from './table'

describe('spredsheedReader', () => {
	let server: SinonFakeServer

	before(() => {
		server = sinon.fakeServer.create()
		server.respondWith(
			'GET',
			'https://spreadsheets.google.com/feeds/cells/spreadsheets-randomID/1/public/full?alt=json',
			[
				200,
				{ 'Content-Type': 'application/json' },
				JSON.stringify(sampleData)
			]
		)
		server.respondWith(
			'GET',
			'https://spreadsheets.google.com/feeds/cells/invalid-spreadsheet/1/public/full?alt=json',
			[
				400,
				{ 'Content-Type': 'text/html' },
				JSON.stringify('<body>Error message</body>')
			]
		)
	})
	describe('constructor', () => {
		it('should build spreadsheetsId from on URL', async () => {
			const spredsheedReader = new SpreadsheetReader('https://docs.google.com/spreadsheets/d/spr1ea_dsh$eets-randomID/edit#gid=0')
			const spreadsheetsId = (spredsheedReader as any).spreadsheetsId
			expect(spreadsheetsId).to.equal('spr1ea_dsh$eets-randomID')
		})
		it('should store spreadsheet id', async () => {
			const spredsheedReader = new SpreadsheetReader('spreadsheets-randomID')
			const spreadsheetsId = (spredsheedReader as any).spreadsheetsId
			expect(spreadsheetsId).to.equal('spreadsheets-randomID')
		})
		it('should not set spreadsheetsId an error for invalid URL', async () => {
			const spredsheedReader = new SpreadsheetReader('https://foo.bar')
			const spreadsheetsId = (spredsheedReader as any).spreadsheetsId
			expect(spreadsheetsId).to.be.undefined
		})
	})
	describe('loadRawJson', () => {
		it('should load valid spreadsheetsJson from spreadsheet id', async () => {
			const spredsheedReader = new SpreadsheetReader('spreadsheets-randomID')
			const loadingRawJson = spredsheedReader.loadSpreadsheetData()
			server.respond()
			const rawJson = await loadingRawJson
			expect(rawJson.feed.author[0].name.$t).to.equal('hj')
			expect(spredsheedReader.xmlError).to.be.undefined
		})
		it('should cache valid spreadsheetsJson', async () => {
			const spredsheedReader = new SpreadsheetReader('spreadsheets-randomID')
			const loadingRawJson = spredsheedReader.loadSpreadsheetData()
			server.respond()
			await loadingRawJson
			expect(spredsheedReader.rawJson.feed.author[0].name.$t).to.equal('hj')
			expect(spredsheedReader.xmlError).to.be.undefined
		})
		it('should cache valid cellList', async () => {
			const spredsheedReader = new SpreadsheetReader('spreadsheets-randomID')
			const loadingRawJson = spredsheedReader.loadSpreadsheetData()
			server.respond()
			await loadingRawJson
			expect(spredsheedReader.cellsList).to.have.length(10)
			expect(spredsheedReader.cellsList[0]).to.deep.equal({
				'cell': 'A1',
				'cellId': 'A1',
				'coll': 'A',
				'collNb': 65,
				'rows': 1,
				'value': 'text',
			})
		})
		it('should cache maxRaw value', async () => {
			const spredsheedReader = new SpreadsheetReader('spreadsheets-randomID')
			const loadingRawJson = spredsheedReader.loadSpreadsheetData()
			server.respond()
			await loadingRawJson
			expect(spredsheedReader.maxRaw).to.equal(4)
		})
		it('should cache maxColl value', async () => {
			const spredsheedReader = new SpreadsheetReader('spreadsheets-randomID')
			const loadingRawJson = spredsheedReader.loadSpreadsheetData()
			server.respond()
			await loadingRawJson
			expect(spredsheedReader.maxColl).to.equal('E')
		})
		it('should fill xmlError for invalid spreadsheets', async () => {
			const spredsheedReader = new SpreadsheetReader('invalid-spreadsheet')
			const loadingRawJson = spredsheedReader.loadSpreadsheetData()
			server.respond()
			try {
				await loadingRawJson
				expect(false).to.be.equal(true, 'error not throw loadRawJson')
			} catch (e) {
				expect(spredsheedReader.xmlError).to.equal('"<body>Error message</body>"')
			}
		})
		it('should throw and error for invalid spreadsheets', async () => {
			const spredsheedReader = new SpreadsheetReader('invalid-spreadsheet')
			const loadingRawJson = spredsheedReader.loadSpreadsheetData()
			server.respond()
			try {
				await loadingRawJson
				expect(false).to.be.equal(true, 'error not throw loadRawJson')
			} catch (e) {
				expect(e.message).to.equal('Unable to load spreadsheets. For more info see xmlError attribute')
			}
		})
	})
	describe('getCellValue', () => {
		it('should return text for a1', () => {
			const spredsheedReader = new SpreadsheetReader('spreadsheets-randomID');
			(spredsheedReader as any)._rawJson = sampleData
			const value = spredsheedReader.getCellValue('a1')
			expect(value).to.equal('text')
		})
		it('should return Hello for B2', () => {
			const spredsheedReader = new SpreadsheetReader('spreadsheets-randomID');
			(spredsheedReader as any)._rawJson = sampleData
			const value = spredsheedReader.getCellValue('B2')
			expect(value).to.equal('Hello')
		})
		it('should return undefined for D1', () => {
			const spredsheedReader = new SpreadsheetReader('spreadsheets-randomID');
			(spredsheedReader as any)._rawJson = sampleData
			const value = spredsheedReader.getCellValue('D1')
			expect(value).to.be.undefined
		})
	})
	describe('getAllLines', () => {
		it('should return all the lignes', () => {
			const spredsheedReader = new SpreadsheetReader('spreadsheets-randomID');
			(spredsheedReader as any).processSpreadsheets(sampleData)
			const value = spredsheedReader.getAllLines()
			expect(value).to.be.deep.equals([
				['text', 'value', 'autre', undefined, 'enfin'],
				['welcome', 'Hello', 'Salut', undefined, 'end'],
				[undefined, undefined, undefined, undefined, undefined],
				['last line', undefined, undefined, undefined, 'last value'],
			])
		})
	})
	describe('generate grid', () => {
		it('lettersGenerator should return letters from A to Z', () => {
			const letters = Array.from((SpreadsheetReader as any).lettersGenerator('Z'))
			expect(letters).to.be.deep.equals(Array.from('ABCDEFGHIJKLMNOPQRSTUVWXYZ'))
		})
		it('numberGenerator should return Numbers from 1 to 1000', () => {
			const numbers = Array.from((SpreadsheetReader as any).numberGenerator(1000))
			expect(numbers).to.have.length(1000)
			expect(numbers[0]).to.be.equal(1)
			expect(numbers[999]).to.be.equal(1000)
		})
		it('should return table in HTMLElement for valid data', async () => {
			const spredsheedReader = new SpreadsheetReader('spreadsheets-randomID');
			(spredsheedReader as any).processSpreadsheets(sampleData)
			const xml = spredsheedReader.getTable()
			expect((xml as HTMLTableElement).innerHTML).to.be.equal(expectedTable)
		})
		it('should return HTMLElement of error message for invalid data', async () => {
			const spredsheedReader = new SpreadsheetReader('spreadsheets-randomID');
			(spredsheedReader as any)._xmlError = '<!DOCTYPE html><html lang="fr"><div>An error <b>Message</b></div></html>'
			const xml = spredsheedReader.getTable()
			expect((xml.firstChild as HTMLElement).innerHTML).to.be.equal('An error <b>Message</b>')
		})
	})
})
