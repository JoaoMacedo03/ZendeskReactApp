import ZAFClient from 'zendesk_app_framework_sdk';

const client = ZAFClient.init();

// const url = "http://localhost:3000/"; 
const url = "assets/index.html";

const ZAF = {
	client: client,
	/// Get instances | Params : location aplication , trigger
	zendeskInternalAPI: '/api/v2',
	makeRequests: ({...data}) => {
		const { url,requestType,bodyParam,dataTypeParam,headersParam,secureParam,contentType,corsParam } = data
		let request = {
			url: url,
			type: requestType
		};

		if(typeof secureParam !== 'undefined'){
			request.secure = secureParam;
		}

		if(typeof headersParam !== 'undefined'){
			request.headers = headersParam;
		}

		if(typeof bodyParam !== 'undefined'){
			request.data = bodyParam;
		}

		if(typeof dataTypeParam !== 'undefined'){
			request.dataType = dataTypeParam;
		}
		
		if(typeof corsParam !== 'undefined'){
			request.cors = corsParam;
		}
		
		if(typeof contentType !== 'undefined'){
			request.contentType = contentType;
		}
		console.log('Request -> ', request)
		return client.request(request);
	},
	getCurAssigneeInfo: () => {
		return client.get('ticket.assignee').then(data => {
			let assignee = data['ticket.assignee'];
			
			return {
				group: assignee.group.name,
				user: assignee.user ? assignee.user.name : '',
				userId: assignee.user ? assignee.user.id : ''
			};
		})
	},
	getSettings: async () => {
		let metadata = await client.metadata();
		return metadata.settings;
	},
	getTicketInfo: async () => {
		return client.get('ticket').then(data => {
			return data.ticket;
		});
	},
	getTicketFields: async () => {
		return ZAF.makeRequests('/api/v2/ticket_fields.json').then(data => {
			return data.ticket_fields;
		});
	},
	getCurrentUser: async () => {
		var me = await ZAF.makeRequests('/api/v2/users/me.json');
		var user = me.user;
		var groups = await ZAF.makeRequests('/api/v2/users/'+user.id+'/groups.json');
		var group = groups.groups.length ? groups.groups[0] : {name: ''};

		return {
			group: group,
			user: user				
		};
	},
	getZendeskAPIData: (apiEndpoint, id) => {
		return client.request('/api/v2/'+apiEndpoint+'/'+id+'.json');
	},
	getTicketField: (id) => {
		return client.get('ticket.customField:custom_field_'+id).then(tf => {
			return tf['ticket.customField:custom_field_' + id]
		});
	},
	hideTicketField: (id) => {
		return client.invoke('ticketFields:custom_field_'+id+'.hide');
	},
	showTicketField: (id) => {
		return client.invoke('ticketFields:custom_field_'+id+'.show');
	},
	disableField: (id) => {
		return client.invoke('ticketFields:custom_field_'+id+'.disable');
	},
	hideShowTicketField: (id) => {
		client.get('ticket.customField:custom_field_'+id).then(data => {
			if(data['ticket.customField:custom_field_'+id] === '' || data['ticket.customField:custom_field_'+id] === undefined){
				client.invoke('ticketFields:custom_field_'+id+'.hide');
			}else{
				client.invoke('ticketFields:custom_field_'+id+'.show');
			}
		});
	},
	hideTicketFieldOptions: (field, options) => {
    client.get(`ticketFields:custom_field_${field}.optionValues`).then(function (res) {
      const fieldOptions = res[`ticketFields:custom_field_${field}.optionValues`];
      if (typeof options === 'string') {
        const fieldOption = fieldOptions.find(opt => opt.value === options);
        if (fieldOption) {
          const fieldOptionIndex = fieldOptions.indexOf(fieldOption);
          client.invoke(`ticketFields:custom_field_${field}.optionValues.${fieldOptionIndex}.hide`);
        }
      } else if (Array.isArray(options)) {
        fieldOptions.forEach((fieldOption, index) => {
          if (options.includes(fieldOption.value)) {
            client.invoke(`ticketFields:custom_field_${field}.optionValues.${index}.hide`);
          }
        });
      }
    });
  },
	notifyMessage: (description, type) => {
		client.invoke('notify', description, (type?type:undefined));
	},
	getInstances: (locationApp, trigger, obj) => {
		return client.get('instances').then(function (instancesData) {
			var instances = instancesData.instances;
			var appClients = [];
			for (var instanceGuid in instances) {
				if (instances[instanceGuid].location === locationApp) {
					appClients.push(client.instance(instanceGuid));
				}
			}
			return appClients;
		}).then(function (appClients) {
			for (var i in appClients) {
				try {
					appClients[i].trigger(trigger,obj);
				} catch (err) {}
			}
		});
	},
	/// Resize | Params: width , height
	resize: (width, height) => {
		client.invoke('resize', { width, height });
	},
	modal: (modalName) => {
		return client.invoke('instances.create', {
			location: 'modal',
			url: url + "?modal=" + modalName,
		}).then(function (modalContext) {
			return modalContext['instances.create'][0].instanceGuid;
		})
	},
	addEventOnChanged: (fieldID, callback) => {
		client.on('ticket.custom_field_'+fieldID+'.changed', callback);
	}
}

export default ZAF; 