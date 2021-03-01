import styled from 'styled-components'

export const Container = styled.div`
    width: 100%;
    max-width: 1160px;
    display: flex;
    flex-direction: column;

    h3 {
        font-size: 13px;
    }
    div + div {
        margin-top: 10px;
    }
`;

export const GitContainer = styled.div`
    div {
        font-size: 13px;
    }  
`;

export const ErrorMessage = styled.span`
    color: red;
    font-size: 13px;
`;

export const CommentContainer = styled.div`
    div {
        textarea {
            height: 40px;
            border-color: ${props => props.error ? 'red' : 'none'}
        }
        display: flex;
        flex-direction: column;
    }
`;

export const TagContainer = styled.div``;

export const FieldContainer = styled.div``;

export const Border = styled.div`
    margin-top: 5px;
    margin-bottom: 5px;
    border-bottom: 1px solid black;
`;
