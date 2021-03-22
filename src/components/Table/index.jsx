import style from "./table.module.scss";

import React from "react";

const Table = ({ columns = [], data = [], classes = "", header = true, onRowClick = () => null, name = null }) => {
  const renderHeader = () => {
    return (
      <tr>
        {columns.map((column, i) => (
          <td key={i} style={{ width: !!column.width ? column.width : "auto", maxWidth: !!column.maxWidth ? column.maxWidth : "initial" }}>
            {!!column.renderHeader ? column.renderHeader(data) : column.name}
          </td>
        ))}
      </tr>
    );
  };
  const renderRow = (row, index) => {
    return (
      <tr id={`${name}-row-${index}`} key={index} onClick={() => onRowClick(row)}>
        {columns.map((c, i) => (
          <td key={i} style={{ width: !!c.width ? c.width : "auto" }}>
            {!!c.render ? c.render(row, index) : row[c.accessor]}
          </td>
        ))}
      </tr>
    );
  };

  return (
    <table border="0" className={`${style.table} ${classes}`}>
      {header ? <thead>{renderHeader()}</thead> : null}
      <tbody>{data.map((d, i) => renderRow(d, i))}</tbody>
    </table>
  );
};

export default Table;
