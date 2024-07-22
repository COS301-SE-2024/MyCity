

export async function CreatTender(authcode: string, amount: number,ticket: string,time : number, user_session : string)
{
    const data = {
        authCode : authcode,
        quote : amount,
        ticket_id : ticket,
        duration : time
    }

    const apiURL = 'https://dahex648v1.execute-api.eu-west-1.amazonaws.com/api/tenders/create'
    const response = await fetch(apiURL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": user_session ,
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        return false;
    }

    const result = await response.json()
    if(result.Status == "Success" )
    {
        return true
    }
    else false
    
    return true;

}

export async function InReview(authcode: string,ticket: string,user_session : string)
{
    const data = {
        authCode : authcode,
        ticket_id : ticket,
    }

    const apiURL = 'https://dahex648v1.execute-api.eu-west-1.amazonaws.com/api/tenders/in-review'
    const response = await fetch(apiURL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": user_session ,
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        return false;
    }

    const result = await response.json()
    if(result.Status == "Success" )
    {
        return true
    }
    else false
    
    return true;

}

export async function AcceptTender(companyname: string,ticket: string,user_session : string)
{
    const data = {
        company_name : companyname,
        ticket_id : ticket,
    }

    const apiURL = 'https://dahex648v1.execute-api.eu-west-1.amazonaws.com/api/tenders/accept'
    const response = await fetch(apiURL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": user_session ,
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        return false;
    }

    const result = await response.json()
    if(result.Status == "Success" )
    {
        return true
    }
    else false
    
    return true;

}