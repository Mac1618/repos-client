import React from 'react'

// react-icons  
import * as FaIcons from "react-icons/fa";
import * as AiIcons from "react-icons/ai";
import * as IoIcons from "react-icons/io";
import * as Io5Icons from "react-icons/io5";
import * as MdIcons from "react-icons/md";
import * as BsIcons from "react-icons/bs";

import * as GiIcons from "react-icons/gi";
// AiOutlineUnorderedList


// All web pages of the manuscript
export const SidebarData = [
  {
    title: 'Dashboard',
    path: "/",
    icons: <MdIcons.MdDashboard/>,
    className: 'nav-text'
  },
  {
    title: 'Repository',
    path: "/repository/groups",
    icons: <MdIcons.MdStorage/>,
    className: 'nav-text'
  },
  {
    title: 'Archive Accounts',
    path: "/archive-accounts",
    icons: <MdIcons.MdDashboard/>,
    className: 'nav-text'
  },
  {
    title: 'New Adviser',
    path: "createaccount",
    icons: <Io5Icons.IoPersonAddSharp />,
    className: 'nav-text'
  },
  {
    title: 'Users Info',
    path: "manageadvisers",
    icons: <MdIcons.MdManageAccounts />,
    className: 'nav-text'
  },
  {
    title: 'Account Settings',
    path: "settings",
    icons: <AiIcons.AiFillSetting />,
    className: 'nav-text'
  },
  
]

export const LoginAndSignup = [
  {
    title: 'Login',
    path: "login",
    icons: <FaIcons.FaUser/>,
    className: 'nav-text'
  },
  {
    title: 'Register',
    path: "register",
    icons: <Io5Icons.IoPersonAddSharp />,
    className: 'nav-text'
  },
]

export const StudentView = [
  {
    title: 'Dashboard',
    path: "/",
    icons: <MdIcons.MdDashboard/>,
    className: 'nav-text'
  },
  {
    title: 'Progress',
    path: "progress",
    icons: <GiIcons.GiProgression/>,
    className: 'nav-text'
  },
  {
    title: 'Grammar Checker',
    path: "grammar",
    icons: <BsIcons.BsTextParagraph/>,
    className: 'nav-text'
  },
  {
    title: 'Reports',
    path: "reports",
    icons: <IoIcons.IoIosPaper />,
    className: 'nav-text'
  },
  {
    title: 'Account Settings',
    path: "settings",
    icons: <AiIcons.AiFillSetting />,
    className: 'nav-text'
  },
]

export const AdminView = [
  {
    title: 'Dashboard',
    path: "/",
    icons: <MdIcons.MdDashboard/>,
    className: 'nav-text'
  },
  {
    title: 'Groups',
    path: "/groups",
    icons: <MdIcons.MdGroups/>,
    className: 'nav-text'
  },
  {
    title: 'Repository',
    path: "repository/files",
    icons: <MdIcons.MdStorage/>,
    className: 'nav-text'
  },
  {
    title: 'Student List',
    path: "studentlist",
    icons: <AiIcons.AiOutlineUnorderedList/>,
    className: 'nav-text'
  },
  {
    title: 'Students Info',
    path: "/manageadvisers/managestudents",
    icons: <MdIcons.MdManageAccounts />,
    className: 'nav-text'
  },
  {
    title: 'Account Settings',
    path: "settings",
    icons: <AiIcons.AiFillSetting />,
    className: 'nav-text'
  },
]