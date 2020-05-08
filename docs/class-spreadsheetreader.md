[simple-spreadsheet-reader](README.md) › [Globals](globals.md) › ["spreadsheetReader"](spreadsheetreader.md) › [SpreadsheetReader](class-spreadsheetreader.md)

# Class: SpreadsheetReader

A simple reader for a Google spreadsheet publish on web.

## Hierarchy

* **SpreadsheetReader**

## Index

### Constructors

* [constructor](class-spreadsheetreader.md#constructor)

### Properties

* [_cellsList](class-spreadsheetreader.md#protected-optional-_cellslist)
* [_maxColl](class-spreadsheetreader.md#protected-optional-_maxcoll)
* [_maxRaw](class-spreadsheetreader.md#protected-optional-_maxraw)
* [_rawJson](class-spreadsheetreader.md#protected-optional-_rawjson)
* [_xmlError](class-spreadsheetreader.md#protected-optional-_xmlerror)
* [httpClient](class-spreadsheetreader.md#protected-httpclient)
* [spreadsheetsIs](class-spreadsheetreader.md#protected-optional-spreadsheetsis)

### Accessors

* [cellsList](class-spreadsheetreader.md#cellslist)
* [maxColl](class-spreadsheetreader.md#maxcoll)
* [maxRaw](class-spreadsheetreader.md#maxraw)
* [rawJson](class-spreadsheetreader.md#rawjson)
* [xmlError](class-spreadsheetreader.md#xmlerror)

### Methods

* [createHeadCell](class-spreadsheetreader.md#protected-createheadcell)
* [generateTable](class-spreadsheetreader.md#protected-generatetable)
* [getAllLines](class-spreadsheetreader.md#getalllines)
* [getCellValue](class-spreadsheetreader.md#getcellvalue)
* [getTable](class-spreadsheetreader.md#gettable)
* [loadSpreadsheetData](class-spreadsheetreader.md#loadspreadsheetdata)
* [processSpreadsheets](class-spreadsheetreader.md#protected-processspreadsheets)
* [formatColl](class-spreadsheetreader.md#static-protected-formatcoll)
* [lettersGenerator](class-spreadsheetreader.md#static-protected-lettersgenerator)
* [numberGenerator](class-spreadsheetreader.md#static-protected-numbergenerator)

## Constructors

###  constructor

\+ **new SpreadsheetReader**(`spreadsheetsUrlOrId`: string): *[SpreadsheetReader](class-spreadsheetreader.md)*

*Defined in [spreadsheetReader.ts:73](https://github.com/hubjac1/simple-spreadsheet-reader/blob/2166dbf/src/spreadsheetReader.ts#L73)*

**Parameters:**

Name | Type |
------ | ------ |
`spreadsheetsUrlOrId` | string |

**Returns:** *[SpreadsheetReader](class-spreadsheetreader.md)*

## Properties

### `Protected` `Optional` _cellsList

• **_cellsList**? : *Array‹[SpredsheedCell](spreadsheetreader.md#spredsheedcell)›*

*Defined in [spreadsheetReader.ts:24](https://github.com/hubjac1/simple-spreadsheet-reader/blob/2166dbf/src/spreadsheetReader.ts#L24)*

___

### `Protected` `Optional` _maxColl

• **_maxColl**? : *undefined | string*

*Defined in [spreadsheetReader.ts:26](https://github.com/hubjac1/simple-spreadsheet-reader/blob/2166dbf/src/spreadsheetReader.ts#L26)*

___

### `Protected` `Optional` _maxRaw

• **_maxRaw**? : *undefined | number*

*Defined in [spreadsheetReader.ts:25](https://github.com/hubjac1/simple-spreadsheet-reader/blob/2166dbf/src/spreadsheetReader.ts#L25)*

___

### `Protected` `Optional` _rawJson

• **_rawJson**? : *[GoogleJsonSpreadsheet](spreadsheetreader.md#googlejsonspreadsheet)*

*Defined in [spreadsheetReader.ts:23](https://github.com/hubjac1/simple-spreadsheet-reader/blob/2166dbf/src/spreadsheetReader.ts#L23)*

___

### `Protected` `Optional` _xmlError

• **_xmlError**? : *undefined | string*

*Defined in [spreadsheetReader.ts:22](https://github.com/hubjac1/simple-spreadsheet-reader/blob/2166dbf/src/spreadsheetReader.ts#L22)*

___

### `Protected` httpClient

• **httpClient**: *HttpClient*

*Defined in [spreadsheetReader.ts:21](https://github.com/hubjac1/simple-spreadsheet-reader/blob/2166dbf/src/spreadsheetReader.ts#L21)*

___

### `Protected` `Optional` spreadsheetsIs

• **spreadsheetsIs**? : *undefined | string*

*Defined in [spreadsheetReader.ts:20](https://github.com/hubjac1/simple-spreadsheet-reader/blob/2166dbf/src/spreadsheetReader.ts#L20)*

## Accessors

###  cellsList

• **get cellsList**(): *Array‹[SpredsheedCell](spreadsheetreader.md#spredsheedcell)›*

*Defined in [spreadsheetReader.ts:48](https://github.com/hubjac1/simple-spreadsheet-reader/blob/2166dbf/src/spreadsheetReader.ts#L48)*

List od cells loaded from google spreadsheet

**Returns:** *Array‹[SpredsheedCell](spreadsheetreader.md#spredsheedcell)›*

___

###  maxColl

• **get maxColl**(): *string*

*Defined in [spreadsheetReader.ts:68](https://github.com/hubjac1/simple-spreadsheet-reader/blob/2166dbf/src/spreadsheetReader.ts#L68)*

get the number of column used in the spreadsheet.

**Returns:** *string*

___

###  maxRaw

• **get maxRaw**(): *number*

*Defined in [spreadsheetReader.ts:58](https://github.com/hubjac1/simple-spreadsheet-reader/blob/2166dbf/src/spreadsheetReader.ts#L58)*

get the number of raw used in the spreadsheet

**Returns:** *number*

___

###  rawJson

• **get rawJson**(): *[GoogleJsonSpreadsheet](spreadsheetreader.md#googlejsonspreadsheet)*

*Defined in [spreadsheetReader.ts:38](https://github.com/hubjac1/simple-spreadsheet-reader/blob/2166dbf/src/spreadsheetReader.ts#L38)*

get raw JSON loaded from google spreadsheet

**Returns:** *[GoogleJsonSpreadsheet](spreadsheetreader.md#googlejsonspreadsheet)*

___

###  xmlError

• **get xmlError**(): *string | undefined*

*Defined in [spreadsheetReader.ts:31](https://github.com/hubjac1/simple-spreadsheet-reader/blob/2166dbf/src/spreadsheetReader.ts#L31)*

XML string of the error message

**Returns:** *string | undefined*

## Methods

### `Protected` createHeadCell

▸ **createHeadCell**(`cellContaint`: string | undefined): *HTMLTableDataCellElement*

*Defined in [spreadsheetReader.ts:242](https://github.com/hubjac1/simple-spreadsheet-reader/blob/2166dbf/src/spreadsheetReader.ts#L242)*

**Parameters:**

Name | Type |
------ | ------ |
`cellContaint` | string &#124; undefined |

**Returns:** *HTMLTableDataCellElement*

___

### `Protected` generateTable

▸ **generateTable**(`maxRaw`: number, `maxCell`: string): *HTMLTableElement*

*Defined in [spreadsheetReader.ts:249](https://github.com/hubjac1/simple-spreadsheet-reader/blob/2166dbf/src/spreadsheetReader.ts#L249)*

**Parameters:**

Name | Type |
------ | ------ |
`maxRaw` | number |
`maxCell` | string |

**Returns:** *HTMLTableElement*

___

###  getAllLines

▸ **getAllLines**(): *Array‹Array‹string | undefined››*

*Defined in [spreadsheetReader.ts:132](https://github.com/hubjac1/simple-spreadsheet-reader/blob/2166dbf/src/spreadsheetReader.ts#L132)*

gel all lines of the spreadsheet in an array of array

**Returns:** *Array‹Array‹string | undefined››*

___

###  getCellValue

▸ **getCellValue**(`cellId`: string): *string | undefined*

*Defined in [spreadsheetReader.ts:125](https://github.com/hubjac1/simple-spreadsheet-reader/blob/2166dbf/src/spreadsheetReader.ts#L125)*

get value of a cell

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`cellId` | string |   |

**Returns:** *string | undefined*

___

###  getTable

▸ **getTable**(): *Node*

*Defined in [spreadsheetReader.ts:201](https://github.com/hubjac1/simple-spreadsheet-reader/blob/2166dbf/src/spreadsheetReader.ts#L201)*

Compute Node elements of the table.
In case of errors the node will contains the error message.

*classes*
- ssr-table: class of the root elements of the table
- ssr-cell-head: class of header cells
- ssr-cell-data: class of cells contains data

*id*
- All data Element have id="ssr-${cellID}"

*results HTML*

```html
<table class="ssr-table">
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

<table class="ssr-table">
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

**Returns:** *Node*

___

###  loadSpreadsheetData

▸ **loadSpreadsheetData**(): *Promise‹[GoogleJsonSpreadsheet](spreadsheetreader.md#googlejsonspreadsheet)›*

*Defined in [spreadsheetReader.ts:105](https://github.com/hubjac1/simple-spreadsheet-reader/blob/2166dbf/src/spreadsheetReader.ts#L105)*

Load spreadsheet data

**Returns:** *Promise‹[GoogleJsonSpreadsheet](spreadsheetreader.md#googlejsonspreadsheet)›*

___

### `Protected` processSpreadsheets

▸ **processSpreadsheets**(`rawJson`: [GoogleJsonSpreadsheet](spreadsheetreader.md#googlejsonspreadsheet)): *[GoogleJsonSpreadsheet](spreadsheetreader.md#googlejsonspreadsheet)*

*Defined in [spreadsheetReader.ts:88](https://github.com/hubjac1/simple-spreadsheet-reader/blob/2166dbf/src/spreadsheetReader.ts#L88)*

**Parameters:**

Name | Type |
------ | ------ |
`rawJson` | [GoogleJsonSpreadsheet](spreadsheetreader.md#googlejsonspreadsheet) |

**Returns:** *[GoogleJsonSpreadsheet](spreadsheetreader.md#googlejsonspreadsheet)*

___

### `Static` `Protected` formatColl

▸ **formatColl**(`cells`: Array‹[SpredsheedCell](spreadsheetreader.md#spredsheedcell)›, `maxColl`: string): *Array‹string | undefined›*

*Defined in [spreadsheetReader.ts:220](https://github.com/hubjac1/simple-spreadsheet-reader/blob/2166dbf/src/spreadsheetReader.ts#L220)*

**Parameters:**

Name | Type |
------ | ------ |
`cells` | Array‹[SpredsheedCell](spreadsheetreader.md#spredsheedcell)› |
`maxColl` | string |

**Returns:** *Array‹string | undefined›*

___

### `Static` `Protected` lettersGenerator

▸ **lettersGenerator**(`maxLetters`: string): *Generator‹string›*

*Defined in [spreadsheetReader.ts:230](https://github.com/hubjac1/simple-spreadsheet-reader/blob/2166dbf/src/spreadsheetReader.ts#L230)*

**Parameters:**

Name | Type |
------ | ------ |
`maxLetters` | string |

**Returns:** *Generator‹string›*

___

### `Static` `Protected` numberGenerator

▸ **numberGenerator**(`maxLines`: number): *Generator‹number›*

*Defined in [spreadsheetReader.ts:236](https://github.com/hubjac1/simple-spreadsheet-reader/blob/2166dbf/src/spreadsheetReader.ts#L236)*

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`maxLines` | number | 100 |

**Returns:** *Generator‹number›*
