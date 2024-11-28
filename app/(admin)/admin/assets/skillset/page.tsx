"use client";
import axios from 'axios';
import { useEffect, useState, useRef } from 'react';
import { SVGSearch } from '@/public/svg/icon';
import { useAuth } from '@/components/context/authContext';

export default function SkillSet() {
  const {userData} = useAuth();
  const alertifyRef = useRef(null);
  const [skills, setSkills] = useState([]);
  const [search, setSearch] = useState("");

  const getSkills = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}cms/skill/all`);
      const data = await response.data;
      setSkills(data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      import('alertifyjs').then((alertify) => {
        alertifyRef.current = alertify;
      });
      getSkills();
    }
  }, []);

  const addSkill = () => {
    if (typeof window !== 'undefined') {
      alertifyRef.current.prompt(
        "Skill Set",
        "Input the skills used",
        "Skill...",
        async function(evt: Event, value: string) {
          try {
            await axios.post(`${process.env.NEXT_PUBLIC_API_URL}cms/skill`, {
              label: value,
              createdBy: userData?.fullname,
            }, {
              headers: {
                'Content-Type': 'application/json',
              }
            });
            alertifyRef.current.success('Success add: ' + value);
            getSkills();
          } catch (err) {
            alertifyRef.current.error('Fail add: ' + value);
          }
        },
        function() {alertifyRef.current.error('Cancel')})
    }
  };

  const editSkill = (skill: string, id: string) => {
    if (typeof window !== 'undefined') {
      alertifyRef.current.prompt("Skill Set","Edit Skill",skill,
        async function(evt: Event, value: string) {
          try {
            await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}cms/skill/${id}`, {
              label: value || skill,
              createdBy: userData?.fullname,
            }, {
              headers: {
                'Content-Type': 'application/json',
              }
            });
            alertifyRef.current.success('Success edit: ' + value);
            getSkills();
          } catch (err) {
            alertifyRef.current.error('Fail edit: ' + value);
          }
        },
        function() {alertifyRef.current.error('Cancel')});
    }
  };

  const deleteSkill = async (id: string) => {
    if (typeof window !== 'undefined') {
      alertifyRef.current.success('Try delete skill');
      try {
        await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}cms/skill/${id}`);
        alertifyRef.current.success('Success delete');
        getSkills();
      } catch (err) {
        alertifyRef.current.error('Fail delete');
      }
    }
  };

  const handleFilter = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value;
    setSearch(searchTerm);
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}cms/skill?search=${searchTerm}`);
      const data = await response.data.data.items;
      setSkills(data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className='w-max-container mx-auto px-6 py-7'>
      <div className='ms-auto mt-5 flex bg-white rounded-lg items-center ps-5 p-2 py-3 border-1 border-gray-300 shadow w-[300px]'>
        <input
          onChange={handleFilter}
          value={search}
          className='font-medium text-gray-600 bg-white focus:border-none outline-none w-full'
          type="text"
          placeholder='Search...'
        />
        <SVGSearch />
      </div>
      <div className='flex gap-4 mt-14 flex-wrap pt-5'>
        {skills.map((skill, index) => (
          <div className='flex' key={index}>
            <button onClick={() => editSkill(skill.label, skill.id)} className='bg-sky-600 text-white rounded-full ps-5 pe-10 py-1 font-medium text-sm flex gap-5 hover:bg-sky-800 transition'>
              <p>{skill.label}</p>
            </button>
            <button onClick={() => deleteSkill(skill.id)} className='text-white hover:text-red-600 font-bold translate-x-[-22px] transition'>x</button>
          </div>
        ))}
        <button onClick={addSkill} className='bg-emerald-500 text-white rounded-full px-3 py-1 font-medium hover:bg-emerald-300 text-sm transition'>+ add</button>
      </div>
    </div>
  );
}
