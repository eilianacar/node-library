const fs = require('fs');
const FileHound = require('filehound');
const colors = require('colors')
const fetch = require("fetch");
const { hostname } = require('os');
const fetchUrl = fetch.fetchUrl;

// Lee el archivo de una ruta especifica
const readFile = (route) => {
  return new Promise ((resolve, reject) => {
    fs.readFile(route, 'UTF-8' , (error, data) => {
      if (error) {
        reject(error)
      } else {
        resolve(extractLinks(data))
      }
    })
  })
}

const readDirectoryFiles = (route) => {
  return new Promise ((resolve, reject) => {
    FileHound.create()
      .paths(route)
      .ext('md')
      .find()
      .then(files => {
        if (files.length == 0) {
          reject(`No se encontraron archivos .md en su directorio ${route}`)
        }
        resolve(files)
      })
  })
}

const extractLinks = (data) => {
  const expReg = /(((https?:\/\/)|(http?:\/\/)|(www\.))[^\s\n]+)(?=\))/g;
  const links = data.match(expReg)
  return links
}

const getHttpStatus = (url) => {
  return new Promise((resolve, reject) => {
    fetchUrl(url, (error, meta, body) => {
      if (error) {
        reject(error)
      } else {
        resolve(meta)
      }
    });
  })
}

const checkStatusCode = (links, route) => {
  links.map(link => {
    getHttpStatus(link)
      .then(response => {
        console.log( route, link, `El estado del link es ${response.status} OK!`.green);
      })
      .catch(error => {
        console.log(`${route} ${error}`,` Fail 404`.red);
      });
  });
}

const stats = (links, route) => {
  let promises = promiseArrangement(links);


  //manipulacion sobre links para obtener la cantidad de links unicos
  /*
    CODE :D
  */

  // promise.allsettled espera a que se terminen de ejecutar todas las promesas dadas y ahi es cuando llama al resolve con un array que contiene los datos del resultado de esas operaciones
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/allSettled
  Promise.allSettled(promises)
    .then(urlResponses => {
      console.log(`Hemos analizado los links de los archivos .md de ${route}`.yellow)

      let totalLinks = urlResponses.filter((urlResponse)=>{
        if (urlResponse === finalUrl){
          return true
        }
        console.log("hola", totalLinks)
      })
      
      let fulfilledLinksCount = urlResponses.filter(urlResponse => urlResponse.status === 'fulfilled').length
      // let rejectedLinksCount = urlResponses.filter(urlResponse => urlResponse.status === 'rejected').length

      console.log('=== Links analizados en el archivo === '.yellow)
      console.log("TOTAL","===>".rainbow, totalLinks)
      console.log("UNIQUE","==>".rainbow, "?")
      // console.log("BAD =====>", rejectedLinksCount)

  })
}

const statsAndValidate = (links, route) => {
  let promises = promiseArrangement(links);

  Promise.allSettled(promises)
    .then(urlResponse => {
      console.log("FILE ===>", route)

      let totalLinks = urlResponse.length
      let rejectedLinksCount = urlResponses.filter(urlResponse => urlResponse.status === 'rejected').length

      console.log('== LINKS READED == ')
      console.log('TOTAL ===>', totalLinks)
      console.log("UNIQUE ====>", "?")
      console.log("BAD ====>", rejectedLinksCount)
    })
}

const promiseArrangement = (links) => {
  let promises = [];
  links.map(link => {
    promises.push(getHttpStatus(link));
  });
  return promises;
}

module.exports = {
  readFile,
  readDirectoryFiles,
  checkStatusCode,
  stats
}
