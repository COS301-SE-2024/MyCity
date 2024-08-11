
import { invalidateCache } from "@/utils/apiUtils";


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
    if(result.data.Status == "Success" )
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
        company_id : companyname,
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
    if(result.data.Status == "Success" )
    {
        return true
    }
    else false
    

}

export async function RejectTender(companyname: string,ticket: string,user_session : string)
{
    const data = {
        company_id : companyname,
        ticket_id : ticket,
    }

    const apiURL = "/api/tenders/reject";
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
    if(result.data.Status == "Success" )
    {
        return true
    }
    else false
    

}

export async function CompleteContract(contract_id: string,user_session : string)
{
    const data = {
        contract_id : contract_id,
    }

    const apiURL = "/api/tenders/completed";
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
    if(result.data.Status == "Success" )
    {
        return true
    }
    else false
    

}

export async function getTicketTenders(ticket_id: string,user_session : string, revalidate?: boolean)
{

    if (revalidate) {
        invalidateCache("tenders-getmunicipalitytenders"); //invalidate the cache
    }

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
        return null;
    }

    const result = await response.json()
    console.log(result)
    if(result.data.Status )
    {
        return null
    }
    else 
    {
        console.log(result.data)
        AssignTenderNumbers(result.data)
        return result.data
    }
    

}

export async function getCompanyTenders(companyname: string,user_session : string,revalidate?: boolean)
{

    if (revalidate) {
        invalidateCache("tenders-getmytenders"); //invalidate the cache
    }

    const apiURL = "/api/tenders/getmytenders";
    const urlWithParams = `${apiURL}?name=${encodeURIComponent(companyname)}`;
    const response = await fetch(urlWithParams, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": user_session ,
        },
    });

    if (!response.ok) {
        return null;
    }

    const result = await response.json()
    console.log(result)
    if(result.data.Status )
    {
        return null
    }
    else 
    {
        console.log(result.data)
        AssignTenderNumbers(result.data)
        return result.data
    }
    

}

export async function getContract(tender_id: string,user_session : string)
{

    const apiURL = "/api/tenders/getcontracts";
    const urlWithParams = `${apiURL}?tender=${encodeURIComponent(tender_id)}`;
    const response = await fetch(urlWithParams, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": user_session ,
        },
    });

    if (!response.ok) {
        return null;
    }

    const result = await response.json()

    if(result.data.Status )
    {
        return null
    }
    else 
    {
        console.log(result)
        AssignContractNumbers(result.data)
        return result.data
    }
    

}

export async function getCompanyContract(company_name: string,tender_id: string,user_session : string,revalidate? : boolean)
{
    if(revalidate)
    {
        invalidateCache("tenders-getcompanycontracts")
    }

    const apiURL = "/api/tenders/getcompanycontracts";
    const urlWithParams = `${apiURL}?company=${encodeURIComponent(company_name)}&tender=${encodeURIComponent(tender_id)}`;
    const response = await fetch(urlWithParams, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": user_session ,
        },
    });

    if (!response.ok) {
        return null;
    }

    const result = await response.json()

    if(result.data.Status )
    {
        return null
    }
    else 
    {
        console.log(result)
        AssignContractNumbers(result.data)
        return result.data
    }
    

}

function CreateTenderNumber(company_name: string): string {
    let ticketnumber = company_name[0].toUpperCase();
    for (let index = 0; index < 2; index++) {
        let randint: number = Math.floor(Math.random() * company_name.length);
        while (company_name[randint] == " " || company_name[randint] == "-" || company_name[randint] == "_") {
            // console.log("inside loop")
            randint = Math.floor(Math.random() * company_name.length);
        }
        ticketnumber += company_name[randint].toUpperCase();
    }
    for (let index = 0; index < 2; index++) {
        const randint = Math.floor(Math.random() * company_name.length) + 1;
        ticketnumber += String(randint);
    }
    return ticketnumber;
}

function AssignTenderNumbers(data: any[]) {
    data.forEach((item: any) => {
        item['tendernumber'] = CreateTenderNumber(item.companyname);
    });
}

function AssignContractNumbers(data: any) {
    
    data['contractnumber'] = CreateTenderNumber(data.companyname);
}
