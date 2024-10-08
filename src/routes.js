import React from "react";

import { Icon } from "@chakra-ui/react";
import {
  MdBarChart,
  MdHome,
} from "react-icons/md";
import { HiUsers } from "react-icons/hi";

import { IoMdMusicalNote } from "react-icons/io";
import { TbReportSearch } from "react-icons/tb";
// Admin Imports
import MainDashboard from "views/admin/default";

// Auth Imports
import AllUsers from "components/AllUsers/AllUsers";
import AddMusic from "components/AddMusic/AddMusic";
import AllMusic from "components/AllMusic/AllMusic";
import Report from "components/Reports/Report";
import Login from "components/Auth/Login/Login";
import Register from "components/Auth/Register/Register";
import AddTheme from "components/AddTheme/AddTheme";
import AllTheme from "components/AllTheme/AllTheme";
import AllCategory from "components/AllCategory/AllCategory";
import AddCategory from "components/AddCategory/AddCategory";
import AddContent from "components/AddContent/AddContent";
import Milan from "components/Milan/Milan";
import RefferId from "components/SalesmenReffer/RefferId";
import CreateCode from "components/SalesmenReffer/CreateRefferCode/CreateCode";
import SalesmenScreen from "components/SalesmenReffer/SalesmenScreen/SalesmenScreen";
import JustSearch from "components/JustSearch/JustSearch";
import JustDeal from "components/JustDeal/JustDeal";
import UserReport from "components/UserReport/UserReport";
import AllListing from "components/AllListing/AllListing";
import AllOffers from "components/AllOffers/AllOffers";
import AllVideos from "components/AllVideos/AllVideos";
import AllJSCategory from "components/AllJSCategory/AllJSCategory";
import AllJDCategory from "components/AllJDCategory/AllJdCategory";
import AllHashtags from "components/AllHashtags/AllHashtags";
import Announcement from "components/Announcement/Announcement";
import Quiz from "components/AddQuiz/Quiz";
import HelpandSupport from "components/HelpandSupport/HelpandSupport";
import LikesData from "components/LIikes/LikesData";
import FollowerData from "components/Followers/FollowerData";
import PaymentDetails from "components/PaymentDetails/PaymentDetails";
import AchieverRankTable from "components/AchieverRank/AchieverRankTable";
import Notification from "components/NotficationWorkjustSearch/Notification";

import PaidUserControl from "components/PaidUserControl/PaidUserControl";
import DashboardJS from "JustSearchAdmin/Dashboard/JustSearchDashboard";
import MainReferal from "JustSearchAdmin/ReferralCode/MainReferal";
import MainSales from "JustSearchAdmin/SalesPersonManagement/MainSales";
import MainBusiness from "JustSearchAdmin/BusinessManagement/MainBusiness";
import MainCalculation from "JustSearchAdmin/Incentive/MainCalculation";
import MainAnalytics from "JustSearchAdmin/Analytics/MainAnalytics";
import UserJs from "JustSearchAdmin/Usermanagement/UserJs";
import MainSetting from "JustSearchAdmin/UserSetting/MainSetting";
import MainFaqs from "JustSearchAdmin/FAQ/MainFaqs";
import PaidUserControlJS from "JustSearchAdmin/PaidUserControl/PaidUserControl";
import ReferId from "components/ReferId/ReferId";






const user = localStorage.getItem("name")

console.log(user);

const routes = user ? [
  {
    name: "Main Dashboard",
    layout: "/admin",
    path: "/default",
    icon: <Icon as={MdHome} width='20px' height='20px' color='inherit' />,
    component: MainDashboard,
  },
 
  {
    name: "All Users",
    layout: "/admin",
    icon: <Icon as={HiUsers} width='20px' height='20px' color='inherit' />,
    path: "/all-users",
    component: AllUsers,
  },
  {
    name: "All Videos",
    layout: "/admin",
    icon: <Icon as={HiUsers} width='20px' height='20px' color='inherit' />,
    path: "/all-videos",
    component: AllVideos,
  },
  {
    name: "Add Music",
    layout: "/admin",
    icon: <Icon as={MdBarChart} width='20px' height='20px' color='inherit' />,
    path: "/add-music",
    component: AddMusic,
  },
  {
    name: "All Music",
    layout: "/admin",
    icon: <Icon as={IoMdMusicalNote} width='20px' height='20px' color='inherit' />,
    path: "/all-music",
    component: AllMusic,
  },
  {
    name: "Post Reports",
    layout: "/admin",
    icon: <Icon as={TbReportSearch} width='20px' height='20px' color='inherit' />,
    path: "/reports",
    component: Report,
  },
  {
    name: "User Reports",
    layout: "/admin",
    icon: <Icon as={TbReportSearch} width='20px' height='20px' color='inherit' />,
    path: "/userreports",
    component: UserReport,
  },
  {
    name: "Add Theme",
    layout: "/admin",
    icon: <Icon as={TbReportSearch} width='20px' height='20px' color='inherit' />,
    path: "/add-theme",
    component: AddTheme,
  },
  {
    name: "All Hashtags",
    layout: "/admin",
    icon: <Icon as={TbReportSearch} width='20px' height='20px' color='inherit' />,
    path: "/add-hashtag",
    component: AllHashtags,
  },
  {
    name: "All Theme",
    layout: "/admin",
    icon: <Icon as={TbReportSearch} width='20px' height='20px' color='inherit' />,
    path: "/all-theme",
    component: AllTheme,
  },
  {
    name: "All Category",
    layout: "/admin",
    icon: <Icon as={TbReportSearch} width='20px' height='20px' color='inherit' />,
    path: "/all-category",
    component: AllCategory,
  },
  {
    name: "Add Category",
    layout: "/admin",
    icon: <Icon as={TbReportSearch} width='20px' height='20px' color='inherit' />,
    path: "/add-category",
    component: AddCategory,
  },
  {
    name: "Add Content",
    layout: "/admin",
    icon: <Icon as={TbReportSearch} width='20px' height='20px' color='inherit' />,
    path: "/add-content",
    component: AddContent,
  },
  {
    name: "Milan",
    layout: "/admin",
    icon: <Icon as={TbReportSearch} width='20px' height='20px' color='inherit' />,
    path: "/milan",
    component: Milan,
  },
  {
    name: "Just Search",
    layout: "/admin",
    icon: <Icon as={TbReportSearch} width='20px' height='20px' color='inherit' />,
    path: "/just-search",
    component: JustSearch,
  },
  {
    name: "All JS Category",
    layout: "/admin",
    icon: <Icon as={TbReportSearch} width='20px' height='20px' color='inherit' />,
    path: "/all-js-category",
    component: AllJSCategory,
  },
  {
    name: "All JD Category",
    layout: "/admin",
    icon: <Icon as={TbReportSearch} width='20px' height='20px' color='inherit' />,
    path: "/all-jd-category",
    component: AllJDCategory,
  },
  {
    name: "All Listing",
    layout: "/admin",
    icon: <Icon as={TbReportSearch} width='20px' height='20px' color='inherit' />,
    path: "/all-listing",
    component: AllListing,
  },
  {
    name: "All Offers",
    layout: "/admin",
    icon: <Icon as={TbReportSearch} width='20px' height='20px' color='inherit' />,
    path: "/all-offers",
    component: AllOffers,
  },
  {
    name: "Just Deal",
    layout: "/admin",
    icon: <Icon as={TbReportSearch} width='20px' height='20px' color='inherit' />,
    path: "/just-deal",
    component: JustDeal,
  },
  {
    name: "Create Reffer Code",
    layout: "/admin",
    icon: <Icon as={TbReportSearch} width='20px' height='20px' color='inherit' />,
    path: "/create-reffer",
    component: CreateCode,
  },
  {
    name: "Salesmen Reffer ID",
    layout: "/admin",
    icon: <Icon as={TbReportSearch} width='20px' height='20px' color='inherit' />,
    path: "/reffer-id",
    component: RefferId,
  },
  {
    name: "Salesmen Screen",
    layout: "/admin",
    icon: <Icon as={TbReportSearch} width='20px' height='20px' color='inherit' />,
    path: "/salesmen-screen",
    component: SalesmenScreen,
  },
  {
    name: "Achievers",
    layout: "/admin",
    icon: <Icon as={TbReportSearch} width='20px' height='20px' color='inherit' />,
    path: "/achieverrank",
    component: AchieverRankTable,
  },
  
  {
    name: "Announcement",
    layout: "/admin",
    icon: <Icon as={TbReportSearch} width='20px' height='20px' color='inherit' />,
    path: "/announcement",
    component: Announcement,
  },

  
  {
    name: "Followers",
    layout: "/admin",
    icon: <Icon as={TbReportSearch} width='20px' height='20px' color='inherit' />,
    path: "/followers",
    component: FollowerData,
  },

  {
    name: "Refer Management",
    layout: "/admin",
    icon: <Icon as={TbReportSearch} width='20px' height='20px' color='inherit' />,
    path: "/refermanagement",
    component: ReferId,
  },
  {
    name: "Payment Details",
    layout: "/admin",
    icon: <Icon as={TbReportSearch} width='20px' height='20px' color='inherit' />,
    path: "/paymentdetails",
    component: PaymentDetails,
  },
  {
    name: "Likes",
    layout: "/admin",
    icon: <Icon as={TbReportSearch} width='20px' height='20px' color='inherit' />,
    path: "/likes",
    component: LikesData,
  },
  {
    name: "Quiz",
    layout: "/admin",
    icon: <Icon as={TbReportSearch} width='20px' height='20px' color='inherit' />,
    path: "/quiz",
    component: Quiz,
  },

  {
    name: "Help and Support",
    layout: "/admin",
    icon: <Icon as={TbReportSearch} width='20px' height='20px' color='inherit' />,
    path: "/help-and-support",
    component: HelpandSupport,
  },
  {
    name: "Paid User Control",
    layout: "/admin",
    icon: <Icon as={TbReportSearch} width='20px' height='20px' color='inherit' />,
    path: "/paiduser-control",
    component: PaidUserControl,
  },
  


  {
    name: "Just Search Admin",
    layout: "/admin",
    icon: <Icon as={TbReportSearch} width='20px' height='20px' color='inherit' />,
    path: "/dashboardjs",
    component: DashboardJS,
  },
  {
    name: "Referal management Just Search",
    layout: "/admin",
    icon: <Icon as={TbReportSearch} width='20px' height='20px' color='inherit' />,
    path: "/referaljs",
    component: MainReferal,
  },
  {
    name: "Sales Management Just Search" ,
    layout: "/admin",
    icon: <Icon as={TbReportSearch} width='20px' height='20px' color='inherit' />,
    path: "/salesmanagementjs",
    component: MainSales,
  },
  {
    name: "Business Management Just Search",
    layout: "/admin",
    icon: <Icon as={TbReportSearch} width='20px' height='20px' color='inherit' />,
    path: "/businessjs",
    component: MainBusiness,
  },
  {
    name: "Incentive Management Just Search",
    layout: "/admin",
    icon: <Icon as={TbReportSearch} width='20px' height='20px' color='inherit' />,
    path: "/incentive-js",
    component: MainCalculation,
  },

  {
    name: "Notification Just search Just Search",
    layout: "/admin",
    icon: <Icon as={TbReportSearch} width='20px' height='20px' color='inherit' />,
    path: "/notification",
    component: Notification,
  },
  {
    name: "Analysis and Report Just search",
    layout: "/admin",
    icon: <Icon as={TbReportSearch} width='20px' height='20px' color='inherit' />,
    path: "/analytics",
    component: MainAnalytics,
  },
  {
    name: "User Management Just Search",
    layout: "/admin",
    icon: <Icon as={TbReportSearch} width='20px' height='20px' color='inherit' />,
    path: "/userjs",
    component: UserJs,
  },
  {
    name: "Paid User Control Just Search",
    layout: "/admin",
    icon: <Icon as={TbReportSearch} width='20px' height='20px' color='inherit' />,
    path: "/paiduserjs",
    component: PaidUserControlJS,
  },
  {
    name: "User Setting Just Search",
    layout: "/admin",
    icon: <Icon as={TbReportSearch} width='20px' height='20px' color='inherit' />,
    path: "/usersettingjs",
    component: MainSetting,
  },
  {
    name: "Help and Support Just Search",
    layout: "/admin",
    icon: <Icon as={TbReportSearch} width='20px' height='20px' color='inherit' />,
    path: "/mainfaqs",
    component: MainFaqs,
  },
  
  
]:[
  {
    name: "Login",
    layout: "/admin",
    icon: <Icon as={TbReportSearch} width='20px' height='20px' color='inherit' />,
    path: "/login",
    component: Login,
  },
  {
    name: "Register",
    layout: "/admin",
    icon: <Icon as={TbReportSearch} width='20px' height='20px' color='inherit' />,
    path: "/register",
    component: Register,
  },
 
]
  // {
  //   name: "Profile",
  //   layout: "/admin",
  //   path: "/profile",
  //   icon: <Icon as={MdPerson} width='20px' height='20px' color='inherit' />,
  //   component: Profile,
  // },
  // {
  //   name: "Sign In",
  //   layout: "/auth",
  //   path: "/sign-in",
  //   icon: <Icon as={MdLock} width='20px' height='20px' color='inherit' />,
  //   component: SignInCentered,
  // },
  // {
  //   name: "RTL Admin",
  //   layout: "/rtl",
  //   path: "/rtl-default",
  //   icon: <Icon as={MdHome} width='20px' height='20px' color='inherit' />,
  //   component: RTL,
  // },


export default routes;
