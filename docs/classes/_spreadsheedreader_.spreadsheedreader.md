[simple-spreadsheet-reader](../index.md) › [Globals](../globals.md) › ["spreadsheedReader"](../modules/_spreadsheedreader_.md) › [SpreadsheedReader](_spreadsheedreader_.spreadsheedreader.md)

# Class: SpreadsheedReader

A simple reader for a Google spreadsheet publish on web.

## Hierarchy

* **SpreadsheedReader**

## Index

### Constructors

* [constructor](_spreadsheedreader_.spreadsheedreader.md#constructor)

### Properties

* [_cellsList](_spreadsheedreader_.spreadsheedreader.md#protected-optional-_cellslist)
* [_maxColl](_spreadsheedreader_.spreadsheedreader.md#protected-optional-_maxcoll)
* [_maxRaw](_spreadsheedreader_.spreadsheedreader.md#protected-optional-_maxraw)
* [_rawJson](_spreadsheedreader_.spreadsheedreader.md#protected-optional-_rawjson)
* [_xmlError](_spreadsheedreader_.spreadsheedreader.md#protected-optional-_xmlerror)
* [httpClient](_spreadsheedreader_.spreadsheedreader.md#protected-httpclient)
* [spreadsheetsIs](_spreadsheedreader_.spreadsheedreader.md#protected-optional-spreadsheetsis)

### Accessors

* [cellsList](_spreadsheedreader_.spreadsheedreader.md#cellslist)
* [maxColl](_spreadsheedreader_.spreadsheedreader.md#maxcoll)
* [maxRaw](_spreadsheedreader_.spreadsheedreader.md#maxraw)
* [rawJson](_spreadsheedreader_.spreadsheedreader.md#rawjson)
* [xmlError](_spreadsheedreader_.spreadsheedreader.md#xmlerror)

### Methods

* [createHeadCell](_spreadsheedreader_.spreadsheedreader.md#protected-createheadcell)
* [generateTable](_spreadsheedreader_.spreadsheedreader.md#protected-generatetable)
* [getAllLines](_spreadsheedreader_.spreadsheedreader.md#getalllines)
* [getCellValue](_spreadsheedreader_.spreadsheedreader.md#getcellvalue)
* [getTable](_spreadsheedreader_.spreadsheedreader.md#gettable)
* [loadSpreadsheetData](_spreadsheedreader_.spreadsheedreader.md#loadspreadsheetdata)
* [processSpreadsheets](_spreadsheedreader_.spreadsheedreader.md#protected-processspreadsheets)
* [formatColl](_spreadsheedreader_.spreadsheedreader.md#static-protected-formatcoll)
* [lettersGenerator](_spreadsheedreader_.spreadsheedreader.md#static-protected-lettersgenerator)
* [numberGenerator](_spreadsheedreader_.spreadsheedreader.md#static-protected-numbergenerator)

## Constructors

###  constructor

\+ **new SpreadsheedReader**(`spreadsheetsUrlOrId`: string): *[SpreadsheedReader](_spreadsheedreader_.spreadsheedreader.md)*

*Defined in [spreadsheedReader.ts:73](https://github.com/hubjac1/simple-spreadsheet-reader/blob/97a5d29/src/spreadsheedReader.ts#L73)*

**Parameters:**

Name | Type |
------ | ------ |
`spreadsheetsUrlOrId` | string |

**Returns:** *[SpreadsheedReader](_spreadsheedreader_.spreadsheedreader.md)*

## Properties

### `Protected` `Optional` _cellsList

• **_cellsList**? : *Array‹[SpredsheedCell](../modules/_spreadsheedreader_.md#spredsheedcell)›*

*Defined in [spreadsheedReader.ts:24](https://github.com/hubjac1/simple-spreadsheet-reader/blob/97a5d29/src/spreadsheedReader.ts#L24)*

___

### `Protected` `Optional` _maxColl

• **_maxColl**? : *undefined | string*

*Defined in [spreadsheedReader.ts:26](https://github.com/hubjac1/simple-spreadsheet-reader/blob/97a5d29/src/spreadsheedReader.ts#L26)*

___

### `Protected` `Optional` _maxRaw

• **_maxRaw**? : *undefined | number*

*Defined in [spreadsheedReader.ts:25](https://github.com/hubjac1/simple-spreadsheet-reader/blob/97a5d29/src/spreadsheedReader.ts#L25)*

___

### `Protected` `Optional` _rawJson

• **_rawJson**? : *[GoogleJsonSpreadsheet](../modules/_spreadsheedreader_.md#googlejsonspreadsheet)*

*Defined in [spreadsheedReader.ts:23](https://github.com/hubjac1/simple-spreadsheet-reader/blob/97a5d29/src/spreadsheedReader.ts#L23)*

___

### `Protected` `Optional` _xmlError

• **_xmlError**? : *undefined | string*

*Defined in [spreadsheedReader.ts:22](https://github.com/hubjac1/simple-spreadsheet-reader/blob/97a5d29/src/spreadsheedReader.ts#L22)*

___

### `Protected` httpClient

• **httpClient**: *HttpClient*

*Defined in [spreadsheedReader.ts:21](https://github.com/hubjac1/simple-spreadsheet-reader/blob/97a5d29/src/spreadsheedReader.ts#L21)*

___

### `Protected` `Optional` spreadsheetsIs

• **spreadsheetsIs**? : *undefined | string*

*Defined in [spreadsheedReader.ts:20](https://github.com/hubjac1/simple-spreadsheet-reader/blob/97a5d29/src/spreadsheedReader.ts#L20)*

## Accessors

###  cellsList

• **get cellsList**(): *Array‹[SpredsheedCell](../modules/_spreadsheedreader_.md#spredsheedcell)›*

*Defined in [spreadsheedReader.ts:48](https://github.com/hubjac1/simple-spreadsheet-reader/blob/97a5d29/src/spreadsheedReader.ts#L48)*

List od cells loaded from google spreadsheet

**Returns:** *Array‹[SpredsheedCell](../modules/_spreadsheedreader_.md#spredsheedcell)›*

___

###  maxColl

• **get maxColl**(): *string*

*Defined in [spreadsheedReader.ts:68](https://github.com/hubjac1/simple-spreadsheet-reader/blob/97a5d29/src/spreadsheedReader.ts#L68)*

get the number of column used in the spreadsheet.

**Returns:** *string*

___

###  maxRaw

• **get maxRaw**(): *number*

*Defined in [spreadsheedReader.ts:58](https://github.com/hubjac1/simple-spreadsheet-reader/blob/97a5d29/src/spreadsheedReader.ts#L58)*

get the number of raw used in the spreadsheet

**Returns:** *number*

___

###  rawJson

• **get rawJson**(): *[GoogleJsonSpreadsheet](../modules/_spreadsheedreader_.md#googlejsonspreadsheet)*

*Defined in [spreadsheedReader.ts:38](https://github.com/hubjac1/simple-spreadsheet-reader/blob/97a5d29/src/spreadsheedReader.ts#L38)*

get raw JSON loaded from google spreadsheet

**Returns:** *[GoogleJsonSpreadsheet](../modules/_spreadsheedreader_.md#googlejsonspreadsheet)*

___

###  xmlError

• **get xmlError**(): *string | undefined*

*Defined in [spreadsheedReader.ts:31](https://github.com/hubjac1/simple-spreadsheet-reader/blob/97a5d29/src/spreadsheedReader.ts#L31)*

XML string of the error message

**Returns:** *string | undefined*

## Methods

### `Protected` createHeadCell

▸ **createHeadCell**(`cellContaint`: string | undefined): *HTMLTableDataCellElement*

*Defined in [spreadsheedReader.ts:242](https://github.com/hubjac1/simple-spreadsheet-reader/blob/97a5d29/src/spreadsheedReader.ts#L242)*

**Parameters:**

Name | Type |
------ | ------ |
`cellContaint` | string &#124; undefined |

**Returns:** *HTMLTableDataCellElement*

___

### `Protected` generateTable

▸ **generateTable**(`maxRaw`: number, `maxCell`: string): *HTMLTableElement*

*Defined in [spreadsheedReader.ts:249](https://github.com/hubjac1/simple-spreadsheet-reader/blob/97a5d29/src/spreadsheedReader.ts#L249)*

**Parameters:**

Name | Type |
------ | ------ |
`maxRaw` | number |
`maxCell` | string |

**Returns:** *HTMLTableElement*

___

###  getAllLines

▸ **getAllLines**(): *Array‹Array‹string | undefined››*

*Defined in [spreadsheedReader.ts:132](https://github.com/hubjac1/simple-spreadsheet-reader/blob/97a5d29/src/spreadsheedReader.ts#L132)*

gel all lines of the spreadsheet in an array of array

**Returns:** *Array‹Array‹string | undefined››*

___

###  getCellValue

▸ **getCellValue**(`cellId`: string): *string | undefined*

*Defined in [spreadsheedReader.ts:125](https://github.com/hubjac1/simple-spreadsheet-reader/blob/97a5d29/src/spreadsheedReader.ts#L125)*

get value of a cell

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`cellId` | string |   |

**Returns:** *string | undefined*

___

###  getTable

▸ **getTable**(): *Node*

*Defined in [spreadsheedReader.ts:201](https://github.com/hubjac1/simple-spreadsheet-reader/blob/97a5d29/src/spreadsheedReader.ts#L201)*

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

▸ **loadSpreadsheetData**(): *Promise‹[GoogleJsonSpreadsheet](../modules/_spreadsheedreader_.md#googlejsonspreadsheet)›*

*Defined in [spreadsheedReader.ts:105](https://github.com/hubjac1/simple-spreadsheet-reader/blob/97a5d29/src/spreadsheedReader.ts#L105)*

Load spreadsheet data

**Returns:** *Promise‹[GoogleJsonSpreadsheet](../modules/_spreadsheedreader_.md#googlejsonspreadsheet)›*

___

### `Protected` processSpreadsheets

▸ **processSpreadsheets**(`rawJson`: [GoogleJsonSpreadsheet](../modules/_spreadsheedreader_.md#googlejsonspreadsheet)): *[GoogleJsonSpreadsheet](../modules/_spreadsheedreader_.md#googlejsonspreadsheet)*

*Defined in [spreadsheedReader.ts:88](https://github.com/hubjac1/simple-spreadsheet-reader/blob/97a5d29/src/spreadsheedReader.ts#L88)*

**Parameters:**

Name | Type |
------ | ------ |
`rawJson` | [GoogleJsonSpreadsheet](../modules/_spreadsheedreader_.md#googlejsonspreadsheet) |

**Returns:** *[GoogleJsonSpreadsheet](../modules/_spreadsheedreader_.md#googlejsonspreadsheet)*

___

### `Static` `Protected` formatColl

▸ **formatColl**(`cells`: Array‹[SpredsheedCell](../modules/_spreadsheedreader_.md#spredsheedcell)›, `maxColl`: string): *Array‹string | undefined›*

*Defined in [spreadsheedReader.ts:220](https://github.com/hubjac1/simple-spreadsheet-reader/blob/97a5d29/src/spreadsheedReader.ts#L220)*

**Parameters:**

Name | Type |
------ | ------ |
`cells` | Array‹[SpredsheedCell](../modules/_spreadsheedreader_.md#spredsheedcell)› |
`maxColl` | string |

**Returns:** *Array‹string | undefined›*

___

### `Static` `Protected` lettersGenerator

▸ **lettersGenerator**(`maxLetters`: string): *Generator‹string›*

*Defined in [spreadsheedReader.ts:230](https://github.com/hubjac1/simple-spreadsheet-reader/blob/97a5d29/src/spreadsheedReader.ts#L230)*

**Parameters:**

Name | Type |
------ | ------ |
`maxLetters` | string |

**Returns:** *Generator‹string›*

___

### `Static` `Protected` numberGenerator

▸ **numberGenerator**(`maxLines`: number): *Generator‹number›*

*Defined in [spreadsheedReader.ts:236](https://github.com/hubjac1/simple-spreadsheet-reader/blob/97a5d29/src/spreadsheedReader.ts#L236)*

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`maxLines` | number | 100 |

**Returns:** *Generator‹number›*
