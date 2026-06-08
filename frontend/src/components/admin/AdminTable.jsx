export default function AdminTable({ columns, rows, rowKey, renderCell }) {
  return (
    <div className="admin-table-wrap">
      <table className="admin-table">
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column}>{column}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row[rowKey]}>
              {columns.map((column) => (
                <td key={column}>{renderCell(column, row)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
