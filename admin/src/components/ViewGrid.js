export default function ViewGrid({grid}) {
    const getColumnStyle = column => {
        return {
            left: column - grid.columnGap * 0.5,
            width: grid.columnGap,
        }
    }

    const getRowStyle = row => {
        return {
            top: row - grid.rowGap * 0.5,
            height: grid.rowGap,
        }
    }

    return <>
        {grid?.columns.map(column => <div key={column} className="view__grid-column" style={getColumnStyle(column)}></div>)}
        {grid?.rows.map(row => <div key={row} className="view__grid-row" style={getRowStyle(row)}></div>)}
    </>
}