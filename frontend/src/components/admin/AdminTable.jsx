function formatHeader(column) {
  return column
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/^id$/i, "ID")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export default function AdminTable({ columns, rows, rowKey, renderCell }) {
  return (
    <div className="admin-table-wrap">
      <table className="admin-table">
        <thead>
          <tr>
            {columns.map((column) => {
              const header = formatHeader(column);
              return <th key={column}>{header}</th>;
            })}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row[rowKey]}>
              {columns.map((column) => {
                const header = formatHeader(column);
                return (
                  <td key={column} data-label={header}>
                    {renderCell(column, row)}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
