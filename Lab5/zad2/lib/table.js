const createCell = (tag, value) => {
  return `<${tag}>${value}</${tag}>`;
}

const createRow = (tag, values) => {
  return `<tr>
  ${values.map(value => createCell(tag, value)).join('\n')}
</tr>`
}

const createTable = (headers, values) => {
  const content = [];
  content.push(createRow('th', headers));
  values.forEach(row => content.push(createRow('td', row)));

  return `<table>
    ${content.join('')}
  </table>`
}


module.exports = {
  createCell,
  createRow,
  createTable
};
