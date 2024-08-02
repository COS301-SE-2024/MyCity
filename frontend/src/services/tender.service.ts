

export async function CreatTender(companyname: string, amount: number,ticket: string,time : number, user_session : string)
{
    const data = {
        company_name : companyname,
        quote : amount,
        ticket_id : ticket,
        duration : time
    }

    const apiURL = "/api/tenders/create";
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
        console.log(result)
        return true
    }
    else return false
    

}

export async function InReview(authcode: string,ticket: string,user_session : string)
{
    const data = {
        authCode : authcode,
        ticket_id : ticket,
    }

    const apiURL = "/api/tenders/in-review";
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

    const apiURL = "/api/tenders/accept";
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

export async function getTicketTenders(ticket_id: string,user_session : string)
{

    const apiURL = "/api/tenders/getmunicipalitytenders";
    const urlWithParams = `${apiURL}?ticket=${encodeURIComponent(ticket_id)}`;
    const response = await fetch(urlWithParams, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": user_session ,
        },
    });

    if (!response.ok) {
        return false;
    }

    const result = await response.json()
    if(result.Status )
    {
        return false
    }
    else result
    

}