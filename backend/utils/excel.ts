import * as XLSX from 'xlsx';
import { SubjectTree, districts, District, SubjectTreeNode } from "../types";

function createSubjectTreeNode(value: string, children?: SubjectTree): SubjectTreeNode {
    children ??= [];
    return {
      title: value,
      value: value,
      key: value,
      children: children,
    }
  }

function getSubjectTree(ws: XLSX.WorkSheet) {
    let subjectTree = new Array(districts.length) as SubjectTree;

    subjectTree = districts.map((item: District) => createSubjectTreeNode(item));

    let currentDistrict = subjectTree.find(subject => subject.title === 'Центральный федеральный округ') as SubjectTreeNode;
    for (let i =  8; i <= 25; ++i) currentDistrict.children.push(createSubjectTreeNode(ws[`E${i}`].v) );

    currentDistrict = subjectTree.find(subject => subject.title === 'Северо-Западный федеральный') as SubjectTreeNode;
    for (let i = 28; i <= 39; ++i) currentDistrict.children.push(createSubjectTreeNode(ws[`E${i}`].v) );

    currentDistrict = subjectTree.find(subject => subject.title === 'Южный федеральный округ') as SubjectTreeNode;
    for (let i = 42; i <= 49; ++i) currentDistrict.children.push(createSubjectTreeNode(ws[`E${i}`].v) );

    currentDistrict = subjectTree.find(subject => subject.title === 'Северо-Кавказский федеральный округ') as SubjectTreeNode;
    for (let i = 52; i <= 58; ++i) currentDistrict.children.push(createSubjectTreeNode(ws[`E${i}`].v) );

    currentDistrict = subjectTree.find(subject => subject.title === 'Приволжский федеральный округ') as SubjectTreeNode;
    for (let i = 61; i <= 62; ++i) currentDistrict.children.push(createSubjectTreeNode(ws[`E${i}`].v) );
    for (let i = 3; i <= 14; ++i) currentDistrict.children.push(createSubjectTreeNode(ws[`H${i}`].v) );

    currentDistrict = subjectTree.find(subject => subject.title === 'Уральский федеральный округ') as SubjectTreeNode;
    for (let i = 17; i <= 23; ++i) currentDistrict.children.push(createSubjectTreeNode(ws[`H${i}`].v) );

    currentDistrict = subjectTree.find(subject => subject.title === 'Сибирский федеральный округ') as SubjectTreeNode;
    for (let i = 26; i <= 35; ++i) currentDistrict.children.push(createSubjectTreeNode(ws[`H${i}`].v) );

    currentDistrict = subjectTree.find(subject => subject.title === 'Дальневосточный федеральный округ ') as SubjectTreeNode;
    for (let i = 38; i <= 48; ++i) currentDistrict.children.push(createSubjectTreeNode(ws[`H${i}`].v) );

    return subjectTree;
}

function readExcel(file: any) {
    const promise: Promise<SubjectTree> = new Promise((resolve, reject) => {
        const fileReader = new FileReader();
        fileReader.readAsArrayBuffer(file);

        fileReader.onload = (e) => {
            const bufferArray = e.target?.result;
            const wb = XLSX.read(bufferArray, {type: "buffer"});
            const wsname = wb.SheetNames[0];
            const ws = wb.Sheets[wsname];
            const subjectTree = getSubjectTree(ws);
            // const data = XLSX.utils.sheet_to_json(ws, {header: 1});
            console.log(subjectTree);
            resolve(subjectTree);
        };

        fileReader.onerror = (error) => {
            reject(error);
        };
    });
}