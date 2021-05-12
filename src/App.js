import React, {useState} from "react";
import XLSX from 'xlsx';

import './App.css';

let STANDARD_WORDS = []

const App = () => {
  const [articles, setArticles] = useState("");
  const [newWords, setNewWords] = useState([]);

  return (
    <div className="content">
      <div className="content__upload">
        <span>上传词汇EXCEL文件：</span>
        <input type="file" accept=".xlsx, .xls" onChange={ file => {
          const { files } = file.target;
          const fileReader = new FileReader();
          fileReader.onload = event => {
            try{
              const { result } = event.target;
              const workbook = XLSX.read(result, {type: "binary"});
              let data = [];
              for(const sheet in workbook.Sheets) {
                if(workbook.Sheets.hasOwnProperty(sheet)) {
                  data = data.concat(XLSX.utils.sheet_to_json(workbook.Sheets[sheet]));
                  break;
                }
              }
              STANDARD_WORDS = data.map(element => element["word"]);
              // console.log("excel数据", STANDARD_WORDS);
            } catch(e) {
              console.log("文件类型不正确")
            }
          }
          fileReader.readAsBinaryString(files[0]);
        }}/>
      </div>
      <textarea 
        className="content__article"
        rows={20}
        onInput={event => {
          setArticles(event.target.value)
        }}
      />
      <button onClick={() => {
        const articleArr = articles.split(/[!\?',;:"“”\.' ]+/).filter(element => element !== "");
        const newWordsCopy = [];
        console.log("before", new Date());
        articleArr.forEach(element => {
          const item = element.trim().toLowerCase();
          if(STANDARD_WORDS.some(word => word.trim().toLowerCase() === item)) {
            newWordsCopy.push(item)
          }
        }) 
        setNewWords(articleArr.filter(element => {
          const item = element.trim().toLowerCase();
          return !newWordsCopy.some(word => word.toLowerCase() === item);
        }));
        console.log("after", new Date());

      }}>查询</button>
      <ol className="content__new-words">
        超纲词汇(个数：{newWords.length})：
        {newWords.map((element, index) => {
          return (
            <li key={`${element}${index}`}>{element}</li>
          )
        })}
      </ol>
    </div>
  )
}

export default App;
