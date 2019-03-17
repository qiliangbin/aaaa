var xlsx = require('node-xlsx');
var nodeExcel = require('excel-export');

const filemd = {
  analysisdata (path) {
    return new Promise((resolve, reject) => {
      // 解析excel文件
      const obj = xlsx.parse(path);
      resolve(obj); // obj为buffer类型
    })
  },
  usersfilterdata (data) {
    let arr = [];
    data.map((item, index) => {
      if(index !== 0) {
        arr.push({
          phoneCard: item[1],
          username: item[0],
          password: item[2],
          age: item[3]
        })
      }
    })
    return arr;
  },

//   导出数据

exportdata (_headers, rows) {
  var conf = {};
  conf.name = 'mysheet';
  conf.cols = [];
  for (let i = 0; i < _headers.length; i++) {
    let col = {};
    col.caption = _headers[i].caption;
    col.type = _headers[i].type;
    conf.cols.push(col);
  }
  conf.rows = rows;
  var result = nodeExcel.execute(conf);
    return result;
}





//   exportdata (data, res) {
//     // console.log('11111', data)
//     let config = {};
//     // config.stylesXmlFile = "styles.xml";
//     config.name = '用户';
//     let alldata = new Array();
//     data.map((item, index) => {
//       let arr = [];
//       arr.push(item.phoneCard);
//       arr.push(item.username);
//       arr.push(item.password);
//       alldata.push(arr);
//     })
//     config.cols = [
//       {
//         caption: 'phoneCard',
//         type:'string'
//       },
//       {
//         caption: 'username',
//         type:'string'
//       },
//       {
//         caption: 'password',
//         type:'string'
//       }]
//     config.rows = alldata;//填充数据
//     var result = nodeExcel.execute(config);
//     // res.send(config)
//     res.setHeader('Content-Type', 'application/vnd.openxmlformats');
//     res.setHeader("Content-Disposition", "attachment; filename=" + "Report.xlsx");
//     res.end(result, 'binary');
//   }
}

module.exports = filemd;