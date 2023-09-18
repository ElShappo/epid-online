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

function mergeTables(worksheets: XLSX.WorkSheet[]): XLSX.WorkSheet {
  // if (worksheets.length === 1) {
  //   console.log('Only one sheet has been added, do not merge anything ')
  //   return worksheets[0];
  // }
  console.log('Preparing to merge sheets');

  // 3D array: aoas[i] - i-th aoa, aoas[i][j] - j-th row of i-th aoa
  let aoas = [] as any;
  let finalAoa = [];

  for (let worksheet of worksheets) {
    let aoa = XLSX.utils.sheet_to_json(worksheet, {header: 1, 
      range: { s: { c: 0, r: 0 }, e: { c: 10, r: 111 } } }
    );
    console.log(aoa);
    aoas.push(aoa);
  }
  
  function getCellSlice(aoas: any, rowIndex: number, columnIndex: number) {
    // get 1D array: arr[i][rowIndex][colIndex], where 'i' loops over the list of 'aoas'
    // 'rowIndex' and 'columnIndex' are fixed
    return aoas.map((aoa: any) => aoa[rowIndex][columnIndex] );
  }

  // j - row, k - column
  // col with index 0 (however, j should != 1) is left intact, values in other cols might change when summing values
  // rows with indices <= 5 (except for row 1 with region name) and index = 7 are also left intact
  for (let j = 0; j < aoas[0].length; ++j) {
    let row = [];
    if (j <= 5 && j !== 1 || j === 7) {
      finalAoa.push(aoas[0][j]);
      continue;
    }
    for (let k = 0; k < aoas[0][0].length; ++k) {
      if (k === 0 && j !== 1) {
        row.push(aoas[0][j][k]);
        continue;
      }

      if (k === 0 && j === 1) {
        let regionsList = getCellSlice(aoas, j, k).join(', ');
        row.push(regionsList);
        continue;
      }

      let cellSlice = getCellSlice(aoas, j, k);
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

      // 1. this set will store only 'false'
      //    iff all corresponding cells in chosen aoas store only numeric vals

      // 2. this set will store only 'true'
      //    iff all corresponding cells in chosen aoas store any type except numeric
      //    (this is most likely to take place with empty cells or cells that store '-')

      // 3. this set will store both 'false' and 'true'
      //    iff in corresponding cells in aoas both numeric and non-numeric types occur
      //    (this is most likely when user has chosen some sheet with no rural population
      //    and some other sheet that has rural population)
      
      // let isNaNSet = new Set();
      // cellSlice.forEach((item: any) => {
      //   let res = true;
      //   if (!isNaN(item) ) {
      //     if (typeof item === 'string') {
      //       if (item.trim().length !== 0) {
      //         res = false;
      //       }
      //     } else {
      //       res = false;
      //     }
      //   } 
      //   isNaNSet.add(res);
      // });
      // row.push(cellSlice)
    }
    finalAoa.push(row);
  }
  return XLSX.utils.aoa_to_sheet(finalAoa);
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

// function readExcel(file: any) {
//     const promise: Promise<SubjectTree> = new Promise((resolve, reject) => {
//         const fileReader = new FileReader();
//         fileReader.readAsArrayBuffer(file);

//         fileReader.onload = (e) => {
//             const bufferArray = e.target?.result;
//             const wb = XLSX.read(bufferArray, {type: "buffer"});
//             const wsname = wb.SheetNames[0];
//             const ws = wb.Sheets[wsname];
//             const subjectTree = getSubjectTree(ws);
//             // const data = XLSX.utils.sheet_to_json(ws, {header: 1});
//             console.log(subjectTree);
//             resolve(subjectTree);
//         };

//         fileReader.onerror = (error) => {
//             reject(error);
//         };
//     });
//     return promise;
// }

export {mergeTables, getSubjectTree};