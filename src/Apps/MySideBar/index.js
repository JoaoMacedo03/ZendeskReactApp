import React, { useState, useEffect, useCallback } from 'react';

import * as AiIcons from 'react-icons/ai'

import ZAF from '../../Services/Zendesk';
import { 
    Container, 
    GitContainer, 
    CommentContainer, 
    TagContainer, 
    FieldContainer,
    Border,
    ErrorMessage,
} from './style';

const MySideBar = () => {
    const client = ZAF.client
    const [ticket, setTicket] = useState({})
    const [inputField, setInptField] = useState('')
    const [textAreaField, setTextAreaField] = useState('')
    const [error, setError] = useState(false)
    const [errorMsg, setErrorMsg] = useState('Something went wrong')
    const [gitHubData, setGitHubData] = useState({id: '', name: '', owner: { login: '' }})
    
    const handleGitHubButton = async () => {
        await ZAF.makeRequests({
                url: 'https://api.github.com/repos/JoaoMacedo03/bookstorebackend', 
                requestType: 'GET',
            }
        ).then(response => {
            setGitHubData(response)
        })
    }

    const handleTagButton = async () => {
        await ZAF.makeRequests({
            url: `/api/v2/tickets/${ticket.id}/tags`,
            requestType: 'PUT',
            bodyParam: {
                tags: ["zendesk"]
            }
        }).then(response => {
            console.log(response)
        })
    }

    const handleFillButton = async () => {
        await client.set(`ticket.customField:custom_field_1260807395509`, inputField)
        .then(response => {
            console.log(response)
        })
    }

    const handleCommentButton = async () => {
        if(!textAreaField) {
            setError(true)
            setErrorMsg('Inform someting on the comment')
        }
        await ZAF.makeRequests({
            url: `/api/v2/tickets/${ticket.id}`,
            requestType: 'PUT',
            dataTypeParam: 'json',
            bodyParam: {
                ticket: {
                    comment: {
                        body: textAreaField,
                        public: false,
                    }
                }                 
            },
            headers: {"Content-Type": "application/json"}
        })
    }

    const handleFillInput = e => {
        setInptField(e.currentTarget.value)
    }

    const handleCommentInput = e => {
        if(error) setError(false)
        setTextAreaField(e.currentTarget.value)
    }

    const fetchTicket = useCallback(async () => {
        await client.get('ticket').then(response => {
            console.log(response)
            setTicket(response.ticket)
        }) 
    }, [client])

    useEffect(() => {
        fetchTicket()
    }, [fetchTicket])
 
    return (
        <Container>
            <GitContainer>
                <h3>Github Data</h3>
                <button onClick={handleGitHubButton}>Fetch Data <AiIcons.AiFillGithub /></button>
                <div>
                    Id: {gitHubData.id}<br />
                    Name: {gitHubData.name}<br />
                    Owner: {gitHubData.owner.login}
                </div>
            </GitContainer>
            <Border />
            <CommentContainer error={error}>
                <h3>Insert Comment</h3>
                <div>
                    {error && <ErrorMessage>{errorMsg}</ErrorMessage>}
                    <textarea type="textarea" value={textAreaField} onChange={e => handleCommentInput(e)} />
                    <button onClick={handleCommentButton}>Insert <AiIcons.AiOutlineComment /></button>
                </div>
            </CommentContainer>
            <Border />
            <FieldContainer>
                <h3>Fill Field</h3>
                <div>
                    <input type="text" value={inputField} onChange={e => handleFillInput(e)} />
                    <button onClick={handleFillButton}>Insert <AiIcons.AiFillEdit /></button>
                </div>
            </FieldContainer>
            <Border />
            <TagContainer>
                <h3>Insert Tag</h3>
                <button onClick={handleTagButton}>Insert <AiIcons.AiFillTag /></button>
            </TagContainer>
        </Container> 
    )
}

export default MySideBar