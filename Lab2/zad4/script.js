'use strict';


// Sample code
;`
create table Customer

alter table Customer add column FirstName
alter table Customer add column LastName
alter table Customer add column email
alter table Customer add column phone

insert into Customer values ('Adam','Kowalski','adam@gmail.com',123456789)
insert into Customer (firstname,phone,lastname) values ('Ewa',987654321,'Kowalska')

select * from Customer


create table Company

alter table Company add column name
alter table Company add column NIP

insert into Company values ('Company1',12324214151242142414)

select * from Company

alter table Company add column Country
insert into Company (name,country) values ('Company2','Poland')

alter table Company drop column nip

select * from Company
select nip from company
`;

const replacer = (key, value) => {
  if(value instanceof Map) {
    return {
      dataType: 'Map',
      value: Array.from(value.entries()),
    };
  } else {
    return value;
  }
}

const reviver = (key, value) => {
  if(typeof value === 'object' && value !== null) {
    if (value.dataType === 'Map') {
      return new Map(value.value);
    }
  }
  return value;
}

class Parser {
  constructor(templates) {
    this.templates = templates
  }

  parse(string) {
    const cleaned = Parser.cleanString(string)

    // Filter possible templates
    const toCheck = new Set(this.templates.filter(template => {
      return template.template.length === cleaned.length
    }))

    if (!toCheck.size) return null

    // Find matching template
    for (let i = 0, chunk = cleaned[i]; i < cleaned.length; i++, chunk = cleaned[i]) {
      for (const template of toCheck) {
        if (!template.template[i].startsWith('$') && 
            !template.template[i].startsWith('@') &&
            template.template[i] !== chunk.toLowerCase()) {
          toCheck.delete(template)
        }
        if (toCheck.size === 0) return null
      }
    }

    // Parse cleaned string based on the template
    const template = toCheck.values().next().value
    const parsed = {
      name: template.name,
      data: {}
    }

    template.template.forEach((chunk, i) => {
      if (chunk.startsWith('@')) {
        parsed.data[chunk.slice(1)] = Parser.parseValues(cleaned[i], true)
      // } else if (chunk.startsWith('#')) {
      //   parsed.data[chunk.slice(1)] = Parser.parseCondition(cleaned[i].toLowerCase())
      } else if (chunk.startsWith('$$$')) {
        parsed.data[chunk.slice(3)] = Parser.parseValues(cleaned[i].toLowerCase(), false, true)
      } else if (chunk.startsWith('$$')) {
        parsed.data[chunk.slice(2)] = Parser.parseValues(cleaned[i].toLowerCase())
      } else if (chunk.startsWith('$')) {
        parsed.data[chunk.slice(1)] = cleaned[i].toLowerCase()
      }
    })

    return parsed
  }

  static cleanString(string) {
    return string.trim().split(/\s+/)
  }

  static parseValues(values, castType, noParentheses) {
    return values
      .slice(!noParentheses, values.length - !noParentheses)
      .split(',')
      .map(value => Parser.parseValue(value, castType))
  }

  static parseValue(value, castType=false) {
    // No value provided
    if (!value.length) return null

    
    if (castType) {
      // Numerical value
      if (!isNaN(value)) return +value
      // String value
      return value.slice(1, value.length - 1)
    } else {
      return value
    }
  }

  // static parseCondition(condition) { // TODO - add where condition and removing rows using this condition
  //   const variables = {}

  //   const fns = condition.split('or').map(alternative => {
      
  //   })

  //   return (...args) => {
      
  //   }
  // }
}


class Table {
  constructor(name) {
    this.data = new Map()
    this.name = name.toLowerCase()
    this.columns = []
    this.no_rows = 0
  }

  static fromData(data) {
    const table = new Table(data.name)
    table.data = data.data
    table.columns = data.columns,
    table.no_rows = data.no_rows
    return table
  }

  addColumn(name) {
    // Validation
    if (this.data.has(name)) return console.error(`Table '${this.name}' already contains '${name}' column`)
    // Adding a column
    this.data.set(name, Array(this.no_rows).fill(null))
    this.columns.push(name)
    console.log(`Successfully added '${name}' column to the '${this.name}' table`)
  }

  dropColumn(name) {
    // Validation
    if (!this.data.has(name)) return console.error(`Table '${this.name}' does not contain '${name}' column`)
    // Removing a column
    this.data.delete(name)
    this.columns.splice(this.columns.indexOf(name), 1)
    console.log(this.columns)
    console.log(`Successfully removed '${name}' column from the '${this.name}' table`)
  }

  insertRow(columnNames, values) {
    // Validation
    if (values?.length > this.columns.length) return console.error(`Too many values to insert into '${this.name}'`)
    if (columnNames) {
      if (columnNames.length !== values.length) return console.error('Specified columns and values must be of the same length')
      for (let columnName of columnNames) {
        if (!this.data.has(columnName)) return console.error(`There is no column '${columnName}' in a '${this.name}' table`)
      }
    }
    
    // Fill the new row with nulls
    this.columns.forEach(columnName => this.data.get(columnName).push(null))
    // Overwrite nulls with specified values
    if (!columnNames) {
      values.forEach((value, i) => this.data.get(this.columns[i])[this.no_rows] = value)
    } else {
      columnNames.forEach((columnName, i) => this.data.get(columnName)[this.no_rows] = values[i])
    }

    this.no_rows++
    console.log(this.no_rows)
  }

  select(what) {
    const result = []
    if (what.length === 1 && what[0] === '*') {
      for (let i = 0; i < this.no_rows; i++) {
        result.push(this.columns.map(columnName => this.data.get(columnName)[i]))
      }
    } else {
      // Validate column names
      for (const columnName of what) {
        if (columnName === '*' || !this.data.has(columnName)) return []
      }
      for (let i = 0; i < this.no_rows; i++) {
        result.push(what.map(columnName => this.data.get(columnName)[i]))
      }
    }
    return result
  }
}


class DataBase {
  static CREATE_TABLE = 'create-table'
  static DROP_TABLE = 'drop-table'
  static ADD_COLUMN = 'add-column'
  static DROP_COLUMN = 'drop-column'
  static INSERT_VALUES = 'insert-values'
  static INSERT_VALUES_DETAILED = 'insert-values-detailed'
  // static DELETE_FROM = 'delete-from'
  static SELECT_FROM = 'select-from'

  constructor() {
    this.db = new Map()
    this.parser = new Parser([
      {
        template: ['create', 'table', '$name'],
        name: DataBase.CREATE_TABLE
      },
      {
        template: ['drop', 'table', '$name'],
        name: DataBase.DROP_TABLE
      },
      {
        template: ['alter', 'table', '$tableName', 'add', 'column', '$columnName'],
        name: DataBase.ADD_COLUMN
      },
      {
        template: ['alter', 'table', '$tableName', 'drop', 'column', '$columnName'],
        name: DataBase.DROP_COLUMN
      },
      {
        template: ['insert', 'into', '$tableName', 'values', '@values'],
        name: DataBase.INSERT_VALUES
      },
      {
        template: ['insert', 'into', '$tableName', '$$columnNames', 'values', '@values'],
        name: DataBase.INSERT_VALUES_DETAILED
      },
      // {
      //   template: ['delete', 'from', '$tableName', 'where', '#condition'],
      //   name: DataBase.DELETE_FROM
      // },
      {
        template: ['select', '$$$what', 'from', '$tableName'],
        name: DataBase.SELECT_FROM
      }
    ])
  }

  execCmd(cmd) {
    const parsed = this.parser.parse(cmd)
    console.log(cmd, parsed)
    if (!parsed) return console.error('Command unrecognized')
    switch (parsed.name) {
      case DataBase.CREATE_TABLE:
        this.createTable(parsed.data)
        break
      case DataBase.DROP_TABLE:
        this.dropTable(parsed.data)
        break
      case DataBase.ADD_COLUMN:
        this.addColumn(parsed.data)
        break
      case DataBase.DROP_COLUMN:
        this.dropColumn(parsed.data)
        break
      case DataBase.INSERT_VALUES:
        this.insertValues(parsed.data)
        break
      case DataBase.DELETE_FROM:
        this.deleteValues(parsed.data)
        break
      case DataBase.INSERT_VALUES_DETAILED:
        this.insertValuesDetailed(parsed.data)
        break
      case DataBase.SELECT_FROM:
        this.selectFrom(parsed.data)
        break
      default:
        console.error('Unable to execute command')
        break
    }
  }

  createTable({ name }) {
    // Validation
    if (this.db.has(name)) return console.error(`Table with name '${name}' already exists`)
    console.log('HERE', name)
    // Creating a table
    this.db.set(name, new Table(name))
    console.log(`Successfully added '${name}' table to the database`)
  }

  dropTable({ name }) {
    // Validation
    if (!this.db.has(name)) return console.error(`There is no table with name '${name}'`)
    // Deleting a table
    this.db.delete(name)
    console.log(`Successfully deleted '${name}' table`)
  }

  addColumn({ tableName, columnName }) {
    // Validation
    if (!this.db.has(tableName)) return console.error(`There is no table with name '${tableName}'`)
    // Adding a column
    this.db.get(tableName).addColumn(columnName)
  }

  dropColumn({ tableName, columnName }) {
    // Validation
    if (!this.db.has(tableName)) return console.error(`There is no table with name '${tableName}'`)
    // Dropping a column
    this.db.get(tableName).dropColumn(columnName)
  }

  insertValues({ tableName, values }) {
    // Validation
    if (!this.db.has(tableName)) return console.error(`There is no table with name '${tableName}'`)
    // Inserting values
    this.db.get(tableName).insertRow(null, values)
  }

  insertValuesDetailed({ tableName, columnNames, values }) {
    // Validation
    if (!this.db.has(tableName)) return console.error(`There is no table with name '${tableName}'`)
    // Inserting values into specified columns
    console.log(this.db.has(tableName))
    console.log(this.db.get(tableName))
    this.db.get(tableName).insertRow(columnNames, values)
  }

  // deleteValues() {

  // }

  selectFrom({ tableName, what }) {
    // Validation
    if (!this.db.has(tableName)) return console.error(`There is no table with name '${tableName}'`)
    // Selecting values from specified columns
    const res = this.db.get(tableName).select(what)
    console.log(res)
    return res
  }

  saveToLocalStorage(name) {
    this._saveToStorage(localStorage, name)
  }
  
  loadFromLocalStorage(name) {
    this._loadFromStorage(localStorage, name)
  }

  saveToSessionStorage(name) {
    this._saveToStorage(sessionStorage, name)
  }

  loadFromSessionStorage(name) {
    this._loadFromStorage(sessionStorage, name)
  }

  _saveToStorage(storage, name) {
    const saved = {
      name,
      tables: []
    }

    for (const table of this.db.values()) {
      saved.tables.push(table)
    }

    storage.setItem(name, JSON.stringify(saved, replacer))
    console.log(`Database '${name} was successfully saved`)
  }

  _loadFromStorage(storage, name) {
    const db = storage.getItem(name)
    if (db) {
      const loaded = JSON.parse(db, reviver)

      for (const table of loaded.tables) {
        this.db.set(table.name, Table.fromData(table))
      }
      console.log(this.db)
      console.log(`Database '${name}' was successfully loaded`)
    } else {
      console.error(`There is no '${name}' database saved`)
    }
  }
}

// Main code
const DB_NAME = 'database'
const db = new DataBase()

const $ = selector => document.querySelector(selector)
const submitBtnEl = $('#input-submit')
const saveBtnLocalEl = $('.menu__button--save-local')
const loadBtnLocalEl = $('.menu__button--load-local')
const saveBtnSessionEl = $('.menu__button--save-session')
const loadBtnSessionEl = $('.menu__button--load-session')
const inputEl = document.forms['input-form'].elements['input']

submitBtnEl.addEventListener('click', e => {
  e.preventDefault()
  const commands = inputEl.value.split('\n')
  commands.forEach(cmd => {
    if (cmd.length) db.execCmd(cmd)
  })
})

saveBtnLocalEl.addEventListener('click', () => db.saveToLocalStorage(DB_NAME))
loadBtnLocalEl.addEventListener('click', () => db.loadFromLocalStorage(DB_NAME))
saveBtnSessionEl.addEventListener('click', () => db.saveToSessionStorage(DB_NAME))
loadBtnSessionEl.addEventListener('click', () => db.loadFromSessionStorage(DB_NAME))
