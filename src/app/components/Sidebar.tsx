import Image from "next/image";
import React from "react";
import { IoCalculator, IoCalendarOutline, IoChatbubbleEllipsesOutline, IoLogoReact, IoPersonOutline } from "react-icons/io5";
import SidebarMenuItem from "./SidebarMenuItem";
import path from "path";
import { title } from "process";


const menuItems = [
    {
      path: "/dashboard/pacientes",
      icon: <IoPersonOutline size={40} />,
      title: "Pacientes",
      subTitle: "Gestión de pacientes",
      subItems: [
        {
          path: "/dashboard/pacientes",
          title: "Listado de Pacientes",
        },
        {
          path: "/dashboard/pacientes/agregar",
          title: "Agregar Nuevo Paciente",
        },
      ],
    },
    {
      path: "/dashboard/consultas",
      icon: <IoChatbubbleEllipsesOutline size={40} />,
      title: "Consultas",
      subTitle: "Gestión de las consultas",
    },
    {
      path: "/dashboard/agenda",
      icon: <IoCalendarOutline size={40} />,
      title: "Agenda",
      subTitle: "Agenda semanal, quincena y mensual",
    },
  ];
  

const Sidebar = () => {
  return (
    <div
      id="menu"
      
      style={{width:'400px'}}
      className="bg-gray-900 min-h-screen z-10 text-slate-300 w-64 left-0  overflow-y-scroll"
    >
      <div id="logo" className="my-4 px-6">
        <h1 className=" flex items-centertext-lg md:text-2xl font-bold text-white">
          <IoLogoReact className="mr-2 "/>
          <span>Dash</span>
          <span className="text-blue-500">8</span>.
        </h1>
        <p className="text-slate-500 text-sm">
          Manage your actions and activities
        </p>
      </div>

      <div id="profile" className="px-6 py-10">
        <p className="text-slate-500">Welcome back,</p>
        <a href="#" className="inline-flex space-x-2 items-center">
          <span>
            {/* <Image
              className="rounded-full w-8 h-8"
              src=""
              alt="Mateo"
              width={50}
              height={50}
            /> */}
          </span>
          <span className="text-sm md:text-base font-bold">Mateo Bertoni</span>
        </a>
      </div>


      <div id="nav" className="w-full px-6">

        {
          menuItems.map(item => (
          <SidebarMenuItem key={item.path} {...item}/>

          ))
        }


      </div>
    </div>
  );
};

export default Sidebar;
