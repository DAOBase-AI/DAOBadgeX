// export data
export const exportJson = (data: any, filename: string) => {
  const str = JSON.stringify(data, null, 4);
  const blob = new Blob([str], { type: 'text/json' });
  const e = new MouseEvent('click');
  const dom = document.createElement('a');
  dom.download = `${filename}.json`;
  dom.href = window.URL.createObjectURL(blob);
  dom.dataset.downloadurl = ['text/json', dom.download, dom.href].join(':');
  dom.dispatchEvent(e);
};

const csvFormat = (str: string) => {
  return String(str)
    .replace(/"/g, '""')
    .replace(/(^[\s\S]*$)/, '"$1"');
};
export const exportCsv = (data: any, filename: string) => {
  /*  */

  const head = Object.keys(data[0]);

  const fileName = `${filename}.csv`;
  const wordSeparator = ',';
  const lineSeparatorEnd = '\r\n';
  const lineSeparatorStart = '';

  const headerStr = `${lineSeparatorStart}${head
    .map((item: string) => csvFormat(item))
    .join(wordSeparator)}${lineSeparatorEnd}`;

  const bodyStr = data
    .map((row: any) => {
      const x = `${lineSeparatorStart}${Object.values(row)
        .map((item: any) => csvFormat(item))
        .join(wordSeparator)}${lineSeparatorEnd}`;
      return x;
    })
    .join('');

  const str = headerStr + bodyStr;

  const blob = new Blob([`\ufeff${str}`], {
    type: 'text/plain;charset=utf-8',
  });

  const e = new MouseEvent('click');
  const dom = document.createElement('a');
  dom.download = fileName;
  dom.href = window.URL.createObjectURL(blob);
  dom.dispatchEvent(e);
};

export const exportXlxs = (data: any) => {
  /*  */
};
