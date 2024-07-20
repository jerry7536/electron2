import Database from 'better-sqlite3'
import { getPathFromEntryAsar } from 'electron-incremental-update/utils'

const db = new Database(':memory:', { nativeBinding: getPathFromEntryAsar('./better_sqlite3.node') })

export function test() {
  db.exec(
    'DROP TABLE IF EXISTS employees; '
    + 'CREATE TABLE IF NOT EXISTS employees (name TEXT, salary INTEGER)',
  )

  db.prepare('INSERT INTO employees VALUES (:n, :s)').run({
    n: 'James',
    s: 5000,
  })

  const r = db.prepare('SELECT * from employees').all()
  console.log(r)
  // [ { name: 'James', salary: 50000 } ]

  db.close()
}
