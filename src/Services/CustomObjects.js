import Zaf from '../Utils/Zendesk';

const customObjectKeyName = 'webmotors_upload_history';

const CustomObjects = {
  getKey: () => {
    return new Promise((resolve,reject) => {
      Zaf.makeRequests('/api/sunshine/objects/types/' + customObjectKeyName,'GET').then(res => {
        resolve();
      }).catch(e => {
        CustomObjects.createKey().then(res => {
          resolve();
        }).catch(e => {
          reject()
        });
      });
    })
    
  },
  createKey: () => {
    let customObject = {
      data: {
        key: customObjectKeyName,
        schema: {
          properties: {
            startedAt: { type: "string" },
            finishedAt: { type: "string" },
            filename: { type: "string" },
            success: { type: "number" },
            errors: { type: "number" },
            list: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  line: { type: "string" },
                  error: { type: "string" },
                  details: { type: "string" }
                },
                required: ['line','error','details'],
              },
              additionalItems : false
            },
          },
          required: ['startedAt']
        }
      }
    }

    return Zaf.makeRequests('/api/sunshine/objects/types','POST',JSON.stringify(customObject),'json',{'Content-type' : 'application/json'});
  },
  getRecords: (pageUrl) => {
    let url = pageUrl ? pageUrl : '/api/sunshine/objects/records?type=' + customObjectKeyName + '&order=desc&per_page=10'; 
    return Zaf.makeRequests(url,'GET');
  },
  addRecord: attrs => {
    let obj = {
      data: {
        type: customObjectKeyName,
        attributes: attrs
      }
    }

    return Zaf.makeRequests('/api/sunshine/objects/records','POST',JSON.stringify(obj),'json',{'Content-type' : 'application/json'});
  },
  delRecord: item => {
    return Zaf.makeRequests('/api/sunshine/objects/records/' + item.id,'DELETE');
  },
  deleteAll: () => {
    return CustomObjects.getRecords().then(res => {
      let promises = res.data.map(item => {
        return CustomObjects.delRecord(item);
      })

      return Promise.all(promises).then(results => {
        return Zaf.makeRequests('/api/sunshine/objects/types/' + customObjectKeyName,'DELETE'); 
      })
    })
  },
  test: () => {
    Zaf.makeRequests('https://apisandbox.superdigital.com.br/docs/','GET');
  }
}

export default CustomObjects;