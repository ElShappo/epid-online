import { TextAreaRef } from "antd/es/input/TextArea";
import {
  delimSymbols,
  inputOptions,
  textAreaAgeEnd,
  textAreaNone,
  textAreaSexRecognition,
  textAreaSexRecognitionAgeEnd,
  textAreaVariations,
} from "../constants/textAreaConstants";

export type EpidTextAreaContentRestrictions = {
  allowOnlyIntegers: boolean;
  upperBound: number | null | undefined;
};
type DelimSymbol = (typeof delimSymbols)[number];

export type InputOption = (typeof inputOptions)[number];

export type InputMode = {
  [index in InputOption]: boolean;
};

// all possible text area indices and titles
export type TextAreaDataIndex = (typeof textAreaVariations)[number]["dataIndex"];
export type TextAreaTitle = (typeof textAreaVariations)[number]["title"];

export type RawEpidTextArea = {
  dataIndex: TextAreaDataIndex;
  title: TextAreaTitle;
  restrictions: EpidTextAreaContentRestrictions;
  ref: TextAreaRef;
  delimSymbol: DelimSymbol;
};

export type EpidTextArea = {
  dataIndex: TextAreaDataIndex;
  title: TextAreaTitle;
  restrictions: EpidTextAreaContentRestrictions;
  content: string;
  delimSymbol: DelimSymbol;
};

export type TableRowFromTextAreas = {
  [Property in TextAreaDataIndex]: string;
};

export type EpidTextAreaSplitted = {
  dataIndex: TextAreaDataIndex;
  title: TextAreaTitle;
  restrictions: EpidTextAreaContentRestrictions;
  content: string[];
  delimSymbol: DelimSymbol;
};

// text area indices and titles for case with sexRecognition and ageEnd
export type TextAreaSexRecognitionAgeEndDataIndex = (typeof textAreaSexRecognitionAgeEnd)[number]["dataIndex"];
export type TextAreaSexRecognitionAgeEndTitle = (typeof textAreaSexRecognitionAgeEnd)[number]["title"];

export type EpidTextAreaSexRecognitionAgeEnd = {
  dataIndex: TextAreaSexRecognitionAgeEndDataIndex;
  title: TextAreaSexRecognitionAgeEndTitle;
  restrictions: EpidTextAreaContentRestrictions;
  content: string;
  delimSymbol: DelimSymbol;
};

// text area indices and titles for case with sexRecognition
export type TextAreaSexRecognitionDataIndex = (typeof textAreaSexRecognition)[number]["dataIndex"];
export type TextAreaSexRecognitionTitle = (typeof textAreaSexRecognition)[number]["title"];

export type EpidTextAreaSexRecognition = {
  dataIndex: TextAreaSexRecognitionDataIndex;
  title: TextAreaSexRecognitionTitle;
  restrictions: EpidTextAreaContentRestrictions;
  content: string;
  delimSymbol: DelimSymbol;
};

// text area indices and titles for case with ageEnd
export type TextAreaAgeEndDataIndex = (typeof textAreaAgeEnd)[number]["dataIndex"];
export type TextAreaAgeEndTitle = (typeof textAreaAgeEnd)[number]["title"];

export type EpidTextAreaAgeEnd = {
  dataIndex: TextAreaAgeEndDataIndex;
  title: TextAreaAgeEndTitle;
  restrictions: EpidTextAreaContentRestrictions;
  content: string;
  delimSymbol: DelimSymbol;
};

// text area indices and titles for case with none
export type TextAreaNoneDataIndex = (typeof textAreaNone)[number]["dataIndex"];
export type TextAreaNoneTitle = (typeof textAreaNone)[number]["title"];

export type EpidTextAreaNone = {
  dataIndex: TextAreaNoneDataIndex;
  title: TextAreaNoneTitle;
  restrictions: EpidTextAreaContentRestrictions;
  content: string;
  delimSymbol: DelimSymbol;
};
