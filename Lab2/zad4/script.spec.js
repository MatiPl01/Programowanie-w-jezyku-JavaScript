"use strict";


const createSampleDB = () => {
  const commands = `
create table Company

alter table Company add column name
alter table Company add column NIP

insert into Company values ('Company1',12324214151242142414)

select * from Company

alter table Company add column Country
insert into Company (name,country) values ('Company2','Poland')

select * from Company
select nip from company
  `.split('\n')

  const db = new DataBase()

  commands.forEach(cmd => {
    if (cmd.trim().length) db.execCmd(cmd)
  })
  
  return db
}
 
const expect = chai.expect

describe('createTable', () => {
  it('should create a table with the specified name (lowercase) in the database if there is no table with this name in a database', () => {
    // Create the first table
    const tableName = 'TaBlE'
    const db = new DataBase()
    db.createTable({ name: tableName })
    const table = db.db.values().next().value
    expect(table.name).to.be.eq(tableName.toLowerCase())
  })
})

describe('dropTable', () => {
  it('should drop an existing table', () => {
    const tableName = 'TaBlE'
    const db = new DataBase()
    db.createTable({ name: tableName })
    db.dropTable({ name: tableName })
    expect([...db.db.values()].length).to.be.eq(0)
  })
})

describe('addColumn', () => {
  it('should add a new column to a table', () => {
    const tableName = 'TaBlE'
    const db = new DataBase()
    db.createTable({ name: tableName })
    db.addColumn({ tableName, columnName: 'FirstName' })
    db.addColumn({ tableName, columnName: 'LstName' })
    expect(db.db.get(tableName).columns.length).to.be.eq(2)
  })
})

describe('dropColumn', () => {
  it('should remove a column from a table', () => {
    const tableName = 'TaBlE'
    const colNames = ['column', 'column1', 'column2', 'column3']
    const db = new DataBase()
    db.createTable({ name: tableName })
    colNames.forEach(columnName => db.addColumn({ tableName, columnName }))
    colNames.forEach(columnName => db.dropColumn({ tableName, columnName }))
    expect(db.db.get(tableName).columns.length).to.be.eq(0)
  })
})

describe('insertValues', () => {
  it('should insert subsequent values to the table', () => {
    const tableName = 'TaBlE'
    const colNames = ['firstName', 'lastName', 'age']
    const values = [
      ['Andrzej', 'Nowak', 26],
      ['Ewa', 'Kowalska', 34]
    ]
    const db = new DataBase()
    db.createTable({ name: tableName })
    colNames.forEach(columnName => db.addColumn({ tableName, columnName }))
    values.forEach(row => db.insertValues({ tableName, values: row }))
    console.log('>>>>>', db.db.get(tableName).no_rows, db.db.get(tableName).data.values(), values.length)
    expect(db.db.get(tableName).no_rows).to.be.eq(values.length)
  })
})

describe('insertValuesDetailed', () => {
  it('should insert subsequent values to the desired columns in a table', () => {
    const tableName = 'TaBlE'
    const colNames = ['firstName', 'lastName', 'age']
    const values = [
      [['age', 'lastname', 'firstname'], [26, 'Nowak', 'Andrzej']],
      [['age', 'firstname'], ['34', 'Ewa']]
    ]
    const db = new DataBase()
    db.createTable({ name: tableName })
    colNames.forEach(columnName => db.addColumn({ tableName, columnName }))
    values.forEach(([columnNames, row]) => db.insertValues({ tableName, columnNames, values: row }))
    console.log(db.db.get(tableName).no_rows)
    expect(db.db.get(tableName).no_rows).to.be.eq(values.length)
  })
})

describe('selectFrom', () => {
  it('select all columns if * was specified', () => {
    const db = createSampleDB()
    const res = db.selectFrom({ tableName: 'company', what: '*' })

    if (res.length) expect(res[0].length).to.be.eq(db.db.get('company').columns.length)
    expect(res.length).to.be.eq(db.db.get('company').no_rows)
  })

  it('select only specified columns', () => {
    const db = createSampleDB()
    const columns = ['name', 'nip']
    
    expect(db.selectFrom({ tableName: 'company', what: columns }).length)
      .to.be.eq(columns.length)
  })
})
