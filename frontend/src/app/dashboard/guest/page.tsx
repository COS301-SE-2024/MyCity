"use client";

import React, { Key, useEffect, useState } from "react";
import { Tabs, Tab } from "@nextui-org/react";
import FaultTable from "@/components/FaultTable/FaultTable";
import FaultMapView from "@/components/FaultMapView/FaultMapView";
import Navbar from "@/components/Navbar/Navbar";
import NavbarMobile from "@/components/Navbar/NavbarMobile";
import { FaTimes } from "react-icons/fa";
import { HelpCircle } from "lucide-react";
import DashboardFaultCardContainer from "@/components/FaultCardContainer/DashboardFualtCardContainer";
import { useProfile } from "@/hooks/useProfile";
import { ThreeDots } from "react-loader-spinner";
import LocationPrompt from "@/components/Location/LocationPrompt";
import {
  getMostUpvote,
  getTicket,
  getTicketsInMunicipality,
  getWatchlistTickets,
} from "@/services/tickets.service";

import NotificationPromt from "@/components/Notifications/NotificationPromt";
import { DashboardTicket } from "@/types/custom.types";

import FaultCardUserView from "@/components/FaultCardUserView/FaultCardUserView";

interface CitizenDashboardProps {
  searchParams: any;
}

// Load mock data on component mount
const mockupvotes = [
  {
    dateClosed: "",
    ticket_id: "7y519d51-c836-44c9-9fee-8601f7ea1af2",
    upvotes: 97,
    ticketnumber: "STL2-4042-25MV",
    address: "Erica St, Cape Winelands District Municipality",
    asset_id: "Animal control issues",
    state: "In Progress",
    dateOpened: "2024-04-22T13:36:00",
    imageURL:
      "https://mycity-storage-bucket.s3.eu-west-1.amazonaws.com/fault_images/photo_Animal_control_issues_4.webp",
    viewcount: 36,
    longitude: "18.9667497752558",
    username: "teboho.thulo@microsoft.com",
    description: "Problem with Animal control issues.",
    latitude: "-33.8977345",
    municipality_id: "Stellenbosch Local",
    commentcount: 0,
    user_picture: "https://i.imgur.com/uR8YLas.png",
    createdby: "Teboho",
    municipality_picture:
      "https://mycity-storage-bucket.s3.eu-west-1.amazonaws.com/municipality_logos/Stellenbosch_Local.png",
    municipality: "Stellenbosch Local",
  },
  {
    dateClosed: "",
    ticket_id: "1qc28139-850c-49b4-tda3-f874ad9fbca1",
    upvotes: 92,
    ticketnumber: "AMJ2-4060-1Z7J",
    address: "Suspence, Amajuba District Municipality",
    asset_id: "Sidewalk cracks",
    state: "Taking Tenders",
    dateOpened: "2024-06-01T11:14:00",
    imageURL:
      "https://mycity-storage-bucket.s3.eu-west-1.amazonaws.com/fault_images/photo_Sidewalk_cracks_3.webp",
    viewcount: 32,
    longitude: "30.1224453847826",
    username: "ahaan.menon@mimecast.com",
    description: "Problem with Faded crosswalks.",
    latitude: "-27.63862",
    municipality_id: "Amajuba District",
    commentcount: 0,
    user_picture: "https://i.imgur.com/ejQ2xsk.png",
    createdby: "Ahaan",
    municipality_picture:
      "https://mycity-storage-bucket.s3.eu-west-1.amazonaws.com/municipality_logos/Amajuba_District.png",
    municipality: "Amajuba District",
  },
  {
    dateClosed: "<empty>",
    ticket_id: "q52cd9a4-10fa-4838-9196-87f805a602ca",
    upvotes: 84,
    ticketnumber: "SLH2-40811-9X60",
    address: "Arbeidslus, Cape Winelands District Municipality",
    asset_id: "Overgrown vegetation",
    state: "In Progress",
    dateOpened: "2024-08-11T20:06:39",
    imageURL:
      "https://mycity-storage-bucket.s3.eu-west-1.amazonaws.com/fault_images/photo_Overgrown_vegetation_3.webp",
    viewcount: 25,
    longitude: 18.8977778,
    username: "janedoe@example.com",
    description: "The slides are falling apart",
    latitude: -33.9241667,
    municipality_id: "Stellenbosch Local",
    commentcount: 0,
    user_picture:
      "https://mycity-storage-bucket.s3.eu-west-1.amazonaws.com/profile_pictures/janedoe@example.com_flag_dark.png",
    createdby: "Kyle",
    municipality_picture:
      "https://mycity-storage-bucket.s3.eu-west-1.amazonaws.com/municipality_logos/Stellenbosch_Local.png",
    municipality: "Stellenbosch Local",
  },
  {
    dateClosed: "<empty>",
    ticket_id: "1r7cd9a4-10fa-4838-9196-87f805a602ca",
    upvotes: 80,
    ticketnumber: "SLH2-40811-9X60",
    address: "Arbeidslus, Cape Winelands District Municipality",
    asset_id: "Playground surface repairs",
    state: "In Progress",
    dateOpened: "2024-08-11T20:06:39",
    imageURL:
      "https://mycity-storage-bucket.s3.eu-west-1.amazonaws.com/fault_images/photo_Playground_surface_repairs_2.webp",
    viewcount: 28,
    longitude: 18.8977778,
    username: "barend.duplessis@telkomsa.net",
    description: "Scratched someone neck from slide",
    latitude: -33.9241667,
    municipality_id: "Stellenbosch Local",
    commentcount: 0,
    user_picture: "https://i.imgur.com/uR8YLas.png",
    createdby: "Barend",
    municipality_picture:
      "https://mycity-storage-bucket.s3.eu-west-1.amazonaws.com/municipality_logos/Stellenbosch_Local.png",
    municipality: "Stellenbosch Local",
  },
  {
    dateClosed: "<empty>",
    ticket_id: "kt7405ae-e98e-4fde-1eb8-fca4cqc2929e",
    upvotes: 77,
    ticketnumber: "TRO2-4070-9CV5",
    address: "Brandwacht, Cape Winelands District Municipality",
    asset_id: "Damaged fire hydrants",
    state: "Closed",
    dateOpened: "2024-08-11T05:39:43",
    imageURL:
      "https://mycity-storage-bucket.s3.eu-west-1.amazonaws.com/fault_images/photo_Damaged_fire_hydrants_0.webp",
    viewcount: 30,
    longitude: 18.8719444,
    username: "scarlett.adams@outlook.com",
    description: "Water swept my dog and wife. Please find my dog",
    latitude: -33.9566667,
    municipality_id: "Stellenbosch Local",
    commentcount: 0,
    user_picture: "https://i.imgur.com/uR8YLas.png",
    createdby: "Scarlett",
    municipality_picture:
      "https://mycity-storage-bucket.s3.eu-west-1.amazonaws.com/municipality_logos/Stellenbosch_Local.png",
    municipality: "Stellenbosch Local",
  },
  {
    dateClosed: "",
    ticket_id: "kk907a51-9c4f-41e9-a8d5-38b1b78baab4",
    upvotes: 45,
    ticketnumber: "AMJ6-4010-3FKM",
    address: "R34, Amajuba District Municipality",
    asset_id: "Clogged storm drains",
    state: "Taking Tenders",
    dateOpened: "2024-04-03T08:05:00",
    imageURL:
      "https://mycity-storage-bucket.s3.eu-west-1.amazonaws.com/fault_images/photo_Clogged_storm_drains_3.webp",
    viewcount: 32,
    longitude: "30.2924453847826",
    username: "lwazi.hadebe@mimecast.com",
    description: "This Burst water pipes problem is a safety hazard.",
    latitude: "-27.66862",
    municipality_id: "Amajuba District",
    commentcount: 0,
    user_picture: "https://i.imgur.com/ejQ2xsk.png",
    createdby: "Lwazi",
    municipality_picture:
      "https://mycity-storage-bucket.s3.eu-west-1.amazonaws.com/municipality_logos/Amajuba_District.png",
    municipality: "Amajuba District",
  },
  {
    dateClosed: "",
    ticket_id: "i7830t2d-7d07-4e43-ba0a-6391fc78d111",
    upvotes: 45,
    ticketnumber: "AMJ2-4040-2DMH",
    address: "Eastbourne, Amajuba District Municipality",
    asset_id: "Illegible street markings",
    state: "Taking Tenders",
    dateOpened: "2024-04-02T00:01:00",
    imageURL:
      "https://mycity-storage-bucket.s3.eu-west-1.amazonaws.com/fault_images/photo_Illegible_street_markings_0.webp",
    viewcount: 39,
    longitude: "30.1224453847826",
    username: "barend.duplessis@telkomsa.net",
    description: "Public art vandalism are everywhere now.",
    latitude: "-27.81862",
    municipality_id: "Amajuba District",
    commentcount: 0,
    user_picture: "https://i.imgur.com/uR8YLas.png",
    createdby: "Barend",
    municipality_picture:
      "https://mycity-storage-bucket.s3.eu-west-1.amazonaws.com/municipality_logos/Amajuba_District.png",
    municipality: "Amajuba District",
  },
  {
    dateClosed: "",
    ticket_id: "5io442fa-97bc-4453-9918-abdb5d9a3f47",
    upvotes: 40,
    ticketnumber: "AMJ2-4040-3NHM",
    address: "Newcastle Ward 9, Amajuba District Municipality",
    asset_id: "Sidewalk cracks",
    state: "Closed",
    dateOpened: "2024-04-03T10:31:00",
    imageURL:
      "https://mycity-storage-bucket.s3.eu-west-1.amazonaws.com/fault_images/photo_Sidewalk_cracks_1.webp",
    viewcount: 21,
    longitude: "30.1524453847826",
    username: "ryno.strydom@telkomsa.net",
    description: "This Broken water fountains problem needs to be fixed.",
    latitude: "-27.80862",
    municipality_id: "Amajuba District",
    commentcount: 0,
    user_picture: "https://i.imgur.com/ge8YJzp.png",
    createdby: "Ryno",
    municipality_picture:
      "https://mycity-storage-bucket.s3.eu-west-1.amazonaws.com/municipality_logos/Amajuba_District.png",
    municipality: "Amajuba District",
  },
  {
    dateClosed: "",
    ticket_id: "a92qa702-23be-6lbd-19h4-157474a3ea6f",
    upvotes: 38,
    ticketnumber: "MAA2-4052-8NAS",
    address: "Makana Ward 11, Sarah Baartman District Municipality",
    asset_id: "Sidewalk cracks",
    state: "Opened",
    dateOpened: "2024-05-28T23:46:00",
    imageURL:
      "https://mycity-storage-bucket.s3.eu-west-1.amazonaws.com/fault_images/photo_Sidewalk_cracks_4.webp",
    viewcount: 30,
    longitude: "26.5623685320641",
    username: "barend.duplessis@telkomsa.net",
    description: "Illegible street markings are everywhere now.",
    latitude: "-33.18233",
    municipality_id: "Makana Local",
    commentcount: 0,
    user_picture: "https://i.imgur.com/uR8YLas.png",
    createdby: "Barend",
    municipality_picture:
      "https://mycity-storage-bucket.s3.eu-west-1.amazonaws.com/municipality_logos/Makana_Local.png",
    municipality: "Makana Local",
  },
  {
    dateClosed: "",
    ticket_id: "qe475494-f620-4b9e-9979-646ad4bce0fa",
    upvotes: 38,
    ticketnumber: "AMJ2-4060-7KKW",
    address: "Madadeni Road, Amajuba District Municipality",
    asset_id: "Sidewalk cracks",
    state: "In Progress",
    dateOpened: "2024-06-07T04:45:00",
    imageURL:
      "https://mycity-storage-bucket.s3.eu-west-1.amazonaws.com/fault_images/photo_Sidewalk_cracks_3.webp",
    viewcount: 30,
    longitude: "30.2124453847826",
    username: "lethabo.mokwena@outlook.com",
    description: "Sidewalk is falling apart",
    latitude: "-27.71862",
    municipality_id: "Amajuba District",
    commentcount: 0,
    user_picture: "https://i.imgur.com/EghDwPU.png",
    createdby: "Lethabo",
    municipality_picture:
      "https://mycity-storage-bucket.s3.eu-west-1.amazonaws.com/municipality_logos/Amajuba_District.png",
    municipality: "Amajuba District",
  },
  {
    dateClosed: "",
    ticket_id: "f4575494-f620-4b9e-b979-646ad4bce0fa",
    upvotes: 32,
    ticketnumber: "AMJ2-4060-7KKW",
    address: "Madadeni Road, Amajuba District Municipality",
    asset_id: "Damaged curbs",
    state: "Taking Tenders",
    dateOpened: "2024-06-07T04:45:00",
    imageURL:
      "https://mycity-storage-bucket.s3.eu-west-1.amazonaws.com/fault_images/photo_Damaged_curbs_2.webp",
    viewcount: 30,
    longitude: "30.2124453847826",
    username: "isabella.wilson@microsoft.com",
    description: "My cub just broke down",
    latitude: "-27.71862",
    municipality_id: "Amajuba District",
    commentcount: 0,
    user_picture: "https://i.imgur.com/xKEKm62.png",
    createdby: "Isabella",
    municipality_picture:
      "https://mycity-storage-bucket.s3.eu-west-1.amazonaws.com/municipality_logos/Amajuba_District.png",
    municipality: "Amajuba District",
  },
  {
    dateClosed: "",
    ticket_id: "fq0642ba-f7f8-4d22-a697-00b2e412381d",
    upvotes: 31,
    ticketnumber: "AMJ2-4050-12V9",
    address: "Madadeni Road, Amajuba District Municipality",
    asset_id: "Overgrown vegetation",
    state: "Taking Tenders",
    dateOpened: "2024-05-01T06:16:00",
    imageURL:
      "https://mycity-storage-bucket.s3.eu-west-1.amazonaws.com/fault_images/photo_Overgrown_vegetation_1.webp",
    viewcount: 33,
    longitude: "30.2024453847826",
    username: "ziyanda.nkosi@icloud.com",
    description: "Carrots are growing everywhere",
    latitude: "-27.68862",
    municipality_id: "Amajuba District",
    commentcount: 0,
    user_picture: "https://i.imgur.com/eQ2LFOY.png",
    createdby: "Ziyanda",
    municipality_picture:
      "https://mycity-storage-bucket.s3.eu-west-1.amazonaws.com/municipality_logos/Amajuba_District.png",
    municipality: "Amajuba District",
  },
  {
    dateClosed: "<empty>",
    ticket_id: "a03405ae-e98e-4fde-1eb8-fca4cqc2929e",
    upvotes: 30,
    ticketnumber: "TRO2-4070-9CV5",
    address: "Brandwacht, Cape Winelands District Municipality",
    asset_id: "Damaged fire hydrants",
    state: "Taking Tenders",
    dateOpened: "2024-08-11T05:39:43",
    imageURL:
      "https://mycity-storage-bucket.s3.eu-west-1.amazonaws.com/fault_images/photo_Damaged_fire_hydrants_1.webp",
    viewcount: 30,
    longitude: 18.8719444,
    username: "ziyanda.nkosi@icloud.com",
    description: "Water i puring everywhere . ",
    latitude: -33.9566667,
    municipality_id: "Stellenbosch Local",
    commentcount: 0,
    user_picture: "https://i.imgur.com/eQ2LFOY.png",
    createdby: "Ziyanda",
    municipality_picture:
      "https://mycity-storage-bucket.s3.eu-west-1.amazonaws.com/municipality_logos/Stellenbosch_Local.png",
    municipality: "Stellenbosch Local",
  },
  {
    dateClosed: "",
    ticket_id: "bd2qa702-23be-4lbd-99h4-157474a3ea6f",
    upvotes: 30,
    ticketnumber: "MAA2-4052-8NAS",
    address: "Makana Ward 11, Sarah Baartman District Municipality",
    asset_id: "Sidewalk cracks",
    state: "In Progress",
    dateOpened: "2024-05-28T23:46:00",
    imageURL:
      "https://mycity-storage-bucket.s3.eu-west-1.amazonaws.com/fault_images/photo_Sidewalk_cracks_2.webp",
    viewcount: 30,
    longitude: "26.5623685320641",
    username: "lethabo.mokwena@outlook.com",
    description: "Illegible street markings are everywhere now.",
    latitude: "-33.18233",
    municipality_id: "Makana Local",
    commentcount: 0,
    user_picture: "https://i.imgur.com/EghDwPU.png",
    createdby: "Lethabo",
    municipality_picture:
      "https://mycity-storage-bucket.s3.eu-west-1.amazonaws.com/municipality_logos/Makana_Local.png",
    municipality: "Makana Local",
  },
  {
    dateClosed: "",
    ticket_id: "r4397a51-9c4f-41e9-a8d5-38b1b78baab4",
    upvotes: 28,
    ticketnumber: "AMJ2-4040-3FKM",
    address: "R34, Amajuba District Municipality",
    asset_id: "Burst water pipes",
    state: "In Progress",
    dateOpened: "2024-04-03T08:05:00",
    imageURL:
      "https://mycity-storage-bucket.s3.eu-west-1.amazonaws.com/fault_images/photo_Burst_water_pipes_0.webp",
    viewcount: 32,
    longitude: "30.1924453847826",
    username: "wyatt.coleman@yahoo.com",
    description: "This Burst water pipes problem is a safety hazard.",
    latitude: "-27.16862",
    municipality_id: "Amajuba District",
    commentcount: 0,
    user_picture: "https://i.imgur.com/EghDwPU.png",
    createdby: "Wyatt",
    municipality_picture:
      "https://mycity-storage-bucket.s3.eu-west-1.amazonaws.com/municipality_logos/Amajuba_District.png",
    municipality: "Amajuba District",
  },
];

const mockMuniResults = [
  {
    dateClosed: "",
    upvotes: 8,
    ticket_id: "f13f4ec8-31b1-4096-95c0-a18643befaec",
    ticketnumber: "CAA2-4042-2RG2",
    address: "Bredasdorp Parkrun, Overberg District Municipality",
    asset_id: "Bridge maintenance",
    state: "Opened",
    dateOpened: "2024-04-22T04:55:00",
    imageURL:
      "https://mycity-storage-bucket.s3.eu-west-1.amazonaws.com/fault_images/photo_Bridge_maintenance_1.webp",
    viewcount: 31,
    longitude: "20.0620719099953",
    username: "buhle.nkomo@mimecast.com",
    description:
      "Its been a while that the Bridge maintenance problem has been an issue.",
    municipality_id: "Cape Agulhas Local",
    latitude: "-34.60867",
    commentcount: 6,
    user_picture: "https://i.imgur.com/EghDwPU.png",
    createdby: "Buhle",
    municipality_picture:
      "https://mycity-storage-bucket.s3.eu-west-1.amazonaws.com/municipality_logos/Cape_Agulhas_Local.png",
    municipality: "Cape Agulhas Local",
  },
  {
    dateClosed: "",
    upvotes: 7,
    ticket_id: "2e20d003-339b-4f10-9f37-9b7a6fef745f",
    ticketnumber: "CAA2-4050-6LEH",
    address: "R319, Overberg District Municipality",
    asset_id: "Overgrown vegetation",
    state: "In Progress",
    dateOpened: "2024-05-06T04:54:00",
    imageURL:
      "https://mycity-storage-bucket.s3.eu-west-1.amazonaws.com/fault_images/photo_Overgrown_vegetation_4.webp",
    viewcount: 32,
    longitude: "20.1520719099953",
    username: "phumla.msibi@gmail.com",
    description: "Fix this Overgrown vegetation problem.",
    municipality_id: "Cape Agulhas Local",
    latitude: "-34.49867",
    commentcount: 6,
    user_picture: "https://i.imgur.com/ge8YJzp.png",
    createdby: "Phumla",
    municipality_picture:
      "https://mycity-storage-bucket.s3.eu-west-1.amazonaws.com/municipality_logos/Cape_Agulhas_Local.png",
    municipality: "Cape Agulhas Local",
  },
  {
    dateClosed: "",
    upvotes: 7,
    ticket_id: "d551ebb8-a920-43d6-b85a-ebbaa19b6f96",
    ticketnumber: "CAA2-4050-46Z3",
    address: "R319, Overberg District Municipality",
    asset_id: "Mislabeled streets",
    state: "In Progress",
    dateOpened: "2024-05-04T09:34:00",
    imageURL:
      "https://mycity-storage-bucket.s3.eu-west-1.amazonaws.com/fault_images/photo_Mislabeled_streets_0.webp",
    viewcount: 33,
    longitude: "20.0820719099953",
    username: "melokuhle.maphumulo@gmail.com",
    description: "Mislabeled streets are everywhere now.",
    municipality_id: "Cape Agulhas Local",
    latitude: "-34.51867",
    commentcount: 6,
    user_picture: "https://i.imgur.com/eQ2LFOY.png",
    createdby: "Melokuhle",
    municipality_picture:
      "https://mycity-storage-bucket.s3.eu-west-1.amazonaws.com/municipality_logos/Cape_Agulhas_Local.png",
    municipality: "Cape Agulhas Local",
  },
  {
    dateClosed: "",
    upvotes: 4,
    ticket_id: "02363974-d7be-4193-ad1d-34b28b8b22fc",
    ticketnumber: "CAA2-4051-3E8K",
    address: "Langverwacht, Overberg District Municipality",
    asset_id: "Overgrown vegetation",
    state: "In Progress",
    dateOpened: "2024-05-13T23:33:00",
    imageURL:
      "https://mycity-storage-bucket.s3.eu-west-1.amazonaws.com/fault_images/photo_Overgrown_vegetation_3.webp",
    viewcount: 23,
    longitude: "19.9820719099953",
    username: "eli.butler@icloud.com",
    description: "Problem with Overgrown vegetation.",
    municipality_id: "Cape Agulhas Local",
    latitude: "-34.53867",
    commentcount: 4,
    user_picture: "https://i.imgur.com/ge8YJzp.png",
    createdby: "Eli",
    municipality_picture:
      "https://mycity-storage-bucket.s3.eu-west-1.amazonaws.com/municipality_logos/Cape_Agulhas_Local.png",
    municipality: "Cape Agulhas Local",
  },
  {
    dateClosed: "",
    upvotes: 7,
    ticket_id: "cf90e692-4524-4417-8c6f-2e71ca6106de",
    ticketnumber: "CAA2-4051-19O5",
    address: "Bredasdorp Parkrun, Overberg District Municipality",
    asset_id: "Vandalized bus stops",
    state: "In Progress",
    dateOpened: "2024-05-11T08:33:00",
    imageURL:
      "https://mycity-storage-bucket.s3.eu-west-1.amazonaws.com/fault_images/photo_Vandalized_bus_stops_3.webp",
    viewcount: 28,
    longitude: "20.0920719099953",
    username: "jabari.xaba@telkomsa.net",
    description: "New Vandalized bus stops problem here.",
    municipality_id: "Cape Agulhas Local",
    latitude: "-34.57867",
    commentcount: 6,
    user_picture: "https://i.imgur.com/hHiyQ5L.png",
    createdby: "Jabari",
    municipality_picture:
      "https://mycity-storage-bucket.s3.eu-west-1.amazonaws.com/municipality_logos/Cape_Agulhas_Local.png",
    municipality: "Cape Agulhas Local",
  },
  {
    dateClosed: "",
    upvotes: 9,
    ticket_id: "a1683263-3a80-4b04-a795-767bd4ca04e4",
    ticketnumber: "CAA2-4052-91JN",
    address: "R319, Overberg District Municipality",
    asset_id: "Hazardous waste spills",
    state: "Taking Tenders",
    dateOpened: "2024-05-29T18:58:00",
    imageURL:
      "https://mycity-storage-bucket.s3.eu-west-1.amazonaws.com/fault_images/photo_Hazardous_waste_spills_0.webp",
    viewcount: 30,
    longitude: "20.0420719099953",
    username: "yolanda.vilakazi@mimecast.com",
    description: "This Hazardous waste spills problem needs to be fixed.",
    municipality_id: "Cape Agulhas Local",
    latitude: "-34.47867",
    commentcount: 5,
    user_picture: "https://i.imgur.com/xKEKm62.png",
    createdby: "Yolanda",
    municipality_picture:
      "https://mycity-storage-bucket.s3.eu-west-1.amazonaws.com/municipality_logos/Cape_Agulhas_Local.png",
    municipality: "Cape Agulhas Local",
  },
  {
    dateClosed: "",
    upvotes: 6,
    ticket_id: "f3e781a0-5324-4668-82fb-89d6c739b31f",
    ticketnumber: "CAA2-4060-757O",
    address: "R319, Overberg District Municipality",
    asset_id: "Street sweeping",
    state: "In Progress",
    dateOpened: "2024-06-07T06:04:00",
    imageURL:
      "https://mycity-storage-bucket.s3.eu-west-1.amazonaws.com/fault_images/photo_Street_sweeping_1.webp",
    viewcount: 33,
    longitude: "20.1420719099953",
    username: "juanita.pieterse@icloud.com",
    description: "This Street sweeping problem is a safety hazard.",
    municipality_id: "Cape Agulhas Local",
    latitude: "-34.44867",
    commentcount: 6,
    user_picture: "https://i.imgur.com/ge8YJzp.png",
    createdby: "Juanita",
    municipality_picture:
      "https://mycity-storage-bucket.s3.eu-west-1.amazonaws.com/municipality_logos/Cape_Agulhas_Local.png",
    municipality: "Cape Agulhas Local",
  },
];


export default function CitizenDashboard({
  searchParams,
}: CitizenDashboardProps) {

  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [dashMostUpvoteResults, setMostUpvoteResults] = useState<any[]>([]);
  const [dashMuniResults, setDashMuniResults] = useState<any[]>([]);
  const [dashWatchResults, setDashWatchResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [unreadNotifications, setUnreadNotifications] = useState(0);

  const [deeplinkTicket, setDeeplinkTicket] = useState<
    DashboardTicket | undefined
  >();
  const deeplinkTicketId = searchParams["t_id"];

  const refreshwatchlist = () => {
    try {
      const mockWatchlistResults = []; // Add watchlist mock data here
      const user_id = "example@gmail.com";
      const user_email = String(user_id).toLowerCase();
      setDashWatchResults(mockupvotes.length > 0 ? mockupvotes : []);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setDashMuniResults(mockupvotes);
    setMostUpvoteResults(mockupvotes);
    refreshwatchlist();
    const mockUnreadNotifications = () => {
      // Mock the unread notifications count with a random number
      const mockUnreadNotifications = Math.floor(Math.random() * 10) + 1; // Random number between 1 and 10
      setUnreadNotifications(mockUnreadNotifications);
    };

    mockUnreadNotifications();
  }, []);

  // const preloadImages = (srcs: string[]) => {
  //   srcs.forEach((src) => {
  //     if (src) {
  //       const link = document.createElement("link");
  //       link.rel = "preload";
  //       link.as = "image";
  //       link.href = src;
  //       document.head.appendChild(link);
  //     }
  //   });
  // };

  const handleTabChange = (key: Key) => {
    const index = Number(key);
  };

  const toggleHelpMenu = () => {
    setIsHelpOpen(!isHelpOpen);
  };

  return (
    <div>
      {/* fault popup used with deeplink starts here*/}

      {deeplinkTicket && (
        <FaultCardUserView
          show={true}
          onClose={() => {
            // update url to remove ticket id parameter
            const url = new URL(window.location.href);
            url.searchParams.delete("t_id");
            window.history.replaceState({}, "", url.toString());
            setDeeplinkTicket(undefined);
          }}
          title={deeplinkTicket.asset_id}
          address={deeplinkTicket.address}
          arrowCount={deeplinkTicket.upvotes}
          commentCount={deeplinkTicket.commentcount}
          viewCount={deeplinkTicket.viewcount}
          ticketId={deeplinkTicket.ticket_id}
          ticketNumber={deeplinkTicket.ticketnumber}
          description={deeplinkTicket.description}
          image={deeplinkTicket.imageURL}
          createdBy={deeplinkTicket.createdby}
          latitude={deeplinkTicket.latitude}
          longitude={deeplinkTicket.longitude}
          urgency={deeplinkTicket.urgency}
          state={deeplinkTicket.state}
          municipality_id={deeplinkTicket.municipality_id}
          refreshwatchlist={refreshwatchlist}
        />
      )}
      {/* fault popup used with deeplink ends here */}

      {/* Desktop View */}
      <div className="hidden sm:block">
        <div className="flex flex-col">
          <Navbar showLogin={true} />


          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundImage:
                'linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url("https://mycity-storage-bucket.s3.eu-west-1.amazonaws.com/resources/Johannesburg-Skyline.webp")',
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              backgroundAttachment: "fixed",
              zIndex: -1,
            }}
          ></div>
          <main>
            <div className="relative">
              <h1 className="text-4xl font-bold text-white text-opacity-80 absolute top-13 transform translate-x-1/4">
                Dashboard
              </h1>
            </div>

            <div className="fixed bottom-4 left-4 z-20">
              <HelpCircle
                data-testid="open-help-menu"
                className="text-white cursor-pointer transform transition-transform duration-300 hover:scale-110 z-20"
                size={24}
                onClick={toggleHelpMenu}
              />
            </div>

            {isHelpOpen && (
              <div
                data-testid="help"
                className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center z-50"
              >
                <div className="bg-white bg-opacity-80 rounded-lg shadow-lg p-4 w-11/12 md:w-3/4 lg:w-1/2 relative">
                  <button
                    data-testid="close-help-menu"
                    className="absolute top-2 right-2 text-gray-700"
                    onClick={toggleHelpMenu}
                  >
                    <FaTimes size={24} />
                  </button>
                  <h2 className="text-xl font-bold mb-4">Help Menu</h2>
                  <p>This dashboard allows you to:</p>
                  <ul className="list-disc list-inside">
                    <li>View the most up-voted issues in your area.</li>
                    <li>See issues nearest to your location.</li>
                    <li>Track issues you have added to your watchlist.</li>
                    <li>
                      Switch between different views: Cards, List, and Map.
                    </li>
                  </ul>
                  <p>
                    Use the tabs to navigate between different sections of the
                    dashboard.
                  </p>
                </div>
              </div>
            )}
            <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-full fixed bottom-10 right-10 shadow-lg z-20">
              + Report Fault
            </button>
            <div className="flex h-[80vh] flex-col items-center rounded-3xl">
              <div className="align-center mt-20">
                <h1 className="text-l text-opacity-80 text-white text-center  mb-2">
                  This is a mocked page of our dashboard. Please login to see
                  the live version.
                </h1>

                {isLoading ? (
                  <div className="flex justify-center items-center">
                    <ThreeDots
                      height="40"
                      width="80"
                      radius="9"
                      color="#ADD8E6"
                      ariaLabel="three-dots-loading"
                      wrapperStyle={{}}
                      wrapperClass=""
                      visible={true}
                    />
                  </div>
                ) : dashMostUpvoteResults.length > 0 ? (
                  <div className="h-full">
                    <DashboardFaultCardContainer
                      cardData={dashMostUpvoteResults}
                      refreshwatch={refreshwatchlist}
                    />
                  </div>
                ) : (
                  <p className="text-center text-white text-opacity-60 text-sm">
                    There are no faults to display.
                  </p>
                )}
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Mobile View */}
      <div className="block sm:hidden ">
        <div className="flex flex-col h-full overflow-hidden">
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundImage:
                'linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url("https://mycity-storage-bucket.s3.eu-west-1.amazonaws.com/resources/Johannesburg-Skyline.webp")',
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              backgroundAttachment: "fixed",
              zIndex: -1,
            }}
          >
            {/* Navbar Top*/}


            {/* Dashboard Content */}
            <div className="h-[85vh]">
              <div className="flex justify-center">
                <h1 className="text-4xl font-bold text-white text-opacity-80 mt-2">
                  Dashboard
                </h1>
              </div>

              <div className="flex h-[80vh] flex-col items-center rounded-3xl">
                <Tabs
                  aria-label="Signup Options"
                  defaultSelectedKey={0}
                  className="flex justify-center w-full rounded-3xl pt-4"
                  classNames={{
                    tab: "min-w-28 min-h-10  bg-white bg-opacity-30 text-black",
                    panel: "w-full h-full",
                    cursor: "w-full border-3 border-blue-700/40",
                    tabContent:
                      "group-data-[selected=true]:font-bold group-data-[selected=true]:dop-shadow-md group-data-[selected=true]:bg-white group-data-[selected=true]:bg-opacity-60 group-data-[selected=true]:text-black",
                  }}
                  onSelectionChange={handleTabChange}
                >
                  <Tab key={0} title="Cards" className="h-full ">
                    <Tabs
                      aria-label="Signup Options"
                      defaultSelectedKey={0}
                      className="mt-2 flex justify-center w-full rounded-3xl "
                      classNames={{
                        tab: "min-w-24 min-h-8bg-white bg-opacity-30 text-black text-xs",
                        panel: "w-full",
                        cursor: "w-full border-3 border-blue-700/40",
                        tabContent:
                          "group-data-[selected=true]:font-bold group-data-[selected=true]:dop-shadow-md group-data-[selected=true]:bg-white group-data-[selected=true]:bg-opacity-60 group-data-[selected=true]:text-black",
                      }}
                      onSelectionChange={handleTabChange}
                    >
                      <Tab key={0} title="Watchlist" className=" h-full">
                        <div className="  h-full">
                          <h1 className="text-l text-opacity-80 text-white text-center mb-2">
                            All of the issues you have in your watchlist.
                          </h1>

                          {isLoading ? (
                            <div className="flex justify-center items-center">
                              <ThreeDots
                                height="40"
                                width="80"
                                radius="9"
                                color="#ADD8E6"
                                ariaLabel="three-dots-loading"
                                wrapperStyle={{}}
                                wrapperClass=""
                                visible={true}
                              />
                            </div>
                          ) : dashWatchResults.length > 0 ? (
                            <div className="h-full">
                              <div className="flex justify-center items-center">
                                <DashboardFaultCardContainer
                                  cardData={dashWatchResults}
                                  refreshwatch={refreshwatchlist}
                                />
                              </div>
                            </div>
                          ) : (
                            <p className="text-center text-white text-opacity-60 text-sm">
                              There are no faults to display.
                            </p>
                          )}
                        </div>
                      </Tab>

                      <Tab key={1} title="Most Upvoted">
                        <div className="w-full text-center"></div>
                        <div className="w-full text-center">
                          <h1 className="text-l text-white text-opacity-80 mb-4">
                            Based on votes from the community in your area.
                          </h1>
                        </div>
                        {isLoading ? (
                          <div className="flex justify-center items-center">
                            <ThreeDots
                              height="40"
                              width="80"
                              radius="9"
                              color="#ADD8E6"
                              ariaLabel="three-dots-loading"
                              wrapperStyle={{}}
                              wrapperClass=""
                              visible={true}
                            />
                          </div>
                        ) : dashMostUpvoteResults.length > 0 ? (
                          <div className="flex justify-center items-center">
                            <DashboardFaultCardContainer
                              cardData={dashMostUpvoteResults}
                              refreshwatch={refreshwatchlist}
                            />
                          </div>
                        ) : (
                          <p className="text-center text-white text-opacity-60 text-sm">
                            There are no faults to display.
                          </p>
                        )}
                      </Tab>

                      <Tab key={2} title="Nearest to you">
                        <h1 className="text-center text-white text-opacity-80 mb-4 ml-2">
                          Based on your proximity to the issue.
                        </h1>

                        {isLoading ? (
                          <div className="flex justify-center items-center">
                            <ThreeDots
                              height="40"
                              width="80"
                              radius="9"
                              color="#ADD8E6"
                              ariaLabel="three-dots-loading"
                              wrapperStyle={{}}
                              wrapperClass=""
                              visible={true}
                            />
                          </div>
                        ) : dashMuniResults.length > 0 ? (
                          <div className="flex justify-center items-center">
                            <DashboardFaultCardContainer
                              cardData={dashMuniResults}
                              refreshwatch={refreshwatchlist}
                            />
                          </div>
                        ) : (
                          <p className="text-center text-sm text-opacity-60 text-white">
                            There are no faults to display.
                          </p>
                        )}
                      </Tab>
                    </Tabs>
                  </Tab>

                  <Tab key={1} title="List">
                    <FaultTable
                      tableitems={dashMostUpvoteResults}
                      refreshwatch={refreshwatchlist}
                    />
                  </Tab>

                  <Tab key={2} title="Map">
                    <div className="flex justify-center z-50 pt-8">
                      <LocationPrompt />
                    </div>
                    <h1 className="text-3xl font-bold mb-4 mt-2 ml-2 text-center text-white text-opacity-70">
                      Faults Near You
                    </h1>
                    <FaultMapView />
                  </Tab>
                </Tabs>
              </div>
            </div>

            {/* Navbar Bottom */}
            <div className="">
              <Navbar showLogin={true} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
