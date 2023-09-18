import * as XLSX from 'xlsx';
import { SubjectTree, districts, District, SubjectTreeNode } from "../types";

function createSubjectTreeNode(title: string, key: string, children?: SubjectTree): SubjectTreeNode {
    children ??= [];
    let value = key;
    return {
      title,
      value,
      key,
      children,
    }
}

function getMergedTablesData(worksheets: XLSX.WorkSheet[]) {
  // this function will return only part of the sheet (in aoa format) in range A7:J112 (ages + population data)

  console.log('Preparing to merge sheets');

  // 3D array: aoas[i] - i-th aoa, aoas[i][j] - j-th row of i-th aoa
  let aoas = [] as any;
  let finalAoa = [];

  for (let worksheet of worksheets) {
    let aoa = XLSX.utils.sheet_to_json(worksheet, {header: 1, 
      range: { s: { c: 0, r: 6 }, e: { c: 9, r: 111 } } }
    );
    aoas.push(aoa);
  }
  
  function getCellSlice(aoas: any, rowIndex: number, columnIndex: number) {
    // get 1D array: arr[i][rowIndex][colIndex], where 'i' loops over the list of 'aoas'
    // 'rowIndex' and 'columnIndex' are fixed
    return aoas.map((aoa: any) => aoa[rowIndex][columnIndex] );
  }

  for (let j = 0; j < aoas[0].length; ++j) {
    let row = [];

    for (let k = 0; k < aoas[0][0].length; ++k) {
      let cellSlice = getCellSlice(aoas, j, k);

      if (k === 0) {
        row.push(cellSlice[0]);
        continue;
      }
      
      cellSlice = cellSlice.filter((item: any) => {
        let isNotNumber = true;
        if (!isNaN(item) ) {
          if (typeof item === 'string') {
            if (item.trim().length !== 0) {
              isNotNumber = false;
            }
          } else {
            isNotNumber = false;
          }
        } 
        return !isNotNumber;
      });

      if (cellSlice.length === 0) {
        row.push('–');
      } else {
        row.push(cellSlice.reduce((sum: number, item: number) => sum + item, 0) );
      }
    }
    finalAoa.push(row);
  }
  return finalAoa;
}

function getSubjectTree(ws: XLSX.WorkSheet) {
    let subjectTree = new Array(districts.length) as SubjectTree;

    subjectTree = districts.map((item: District, i) => createSubjectTreeNode(item, `2.${i + 1}.`));

    let currentDistrict = subjectTree.find(subject => subject.title === 'Центральный федеральный округ') as SubjectTreeNode;
    for (let i =  8; i <= 25; ++i) currentDistrict.children.push(createSubjectTreeNode(ws[`E${i}`].v, ws[`D${i}`].v) );

    currentDistrict = subjectTree.find(subject => subject.title === 'Северо-Западный федеральный') as SubjectTreeNode;
    for (let i = 28; i <= 39; ++i) currentDistrict.children.push(createSubjectTreeNode(ws[`E${i}`].v, ws[`D${i}`].v) );

    currentDistrict = subjectTree.find(subject => subject.title === 'Южный федеральный округ') as SubjectTreeNode;
    for (let i = 42; i <= 49; ++i) currentDistrict.children.push(createSubjectTreeNode(ws[`E${i}`].v, ws[`D${i}`].v) );

    currentDistrict = subjectTree.find(subject => subject.title === 'Северо-Кавказский федеральный округ') as SubjectTreeNode;
    for (let i = 52; i <= 58; ++i) currentDistrict.children.push(createSubjectTreeNode(ws[`E${i}`].v, ws[`D${i}`].v) );

    currentDistrict = subjectTree.find(subject => subject.title === 'Приволжский федеральный округ') as SubjectTreeNode;
    for (let i = 61; i <= 62; ++i) currentDistrict.children.push(createSubjectTreeNode(ws[`E${i}`].v, ws[`D${i}`].v) );
    for (let i = 3; i <= 14; ++i) currentDistrict.children.push(createSubjectTreeNode(ws[`H${i}`].v, ws[`G${i}`].v) );

    currentDistrict = subjectTree.find(subject => subject.title === 'Уральский федеральный округ') as SubjectTreeNode;
    for (let i = 17; i <= 23; ++i) currentDistrict.children.push(createSubjectTreeNode(ws[`H${i}`].v, ws[`G${i}`].v) );

    currentDistrict = subjectTree.find(subject => subject.title === 'Сибирский федеральный округ') as SubjectTreeNode;
    for (let i = 26; i <= 35; ++i) currentDistrict.children.push(createSubjectTreeNode(ws[`H${i}`].v, ws[`G${i}`].v) );

    currentDistrict = subjectTree.find(subject => subject.title === 'Дальневосточный федеральный округ ') as SubjectTreeNode;
    for (let i = 38; i <= 48; ++i) currentDistrict.children.push(createSubjectTreeNode(ws[`H${i}`].v, ws[`G${i}`].v) );

    return subjectTree;
}

export {getMergedTablesData, getSubjectTree};