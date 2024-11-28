import axios from 'axios';
import { redirect } from 'next/navigation';
import {ApiResponse} from "@/components/interface/userInterface"
import AddUser from './_addUser';

export default async function Auth(token: any) {
  let userData: ApiResponse | null = null;
  // const { setUserData } = useAuth(); // Akses setUserData dari context
  const requestBody = {
    // tambahkan data sesuai kebutuhan
  };
  try {
    const response = await axios.post('https://my.prasmul-eli.co/api/users/checktoken', requestBody, {
      headers: {
        Authorization: `Bearer ${token.params.slug}`,
        'Content-Type': 'application/json',
      },
    })
    userData = response.data;
  } catch (error) {
    if (error.response) {
      console.error('Error Response:', error.response.status, error.response.data);
      return redirect('https://my.prasmul-eli.co/');
    } else if (error.request) {
      console.error('No Response:', error.request);
    } else {
      console.error('Axios Error:', error.message);
    }
  }

  return (
    <div className='w-full h-screen grid items-center content-center justify-center'>
      <img src="/img/waiting.png" alt="verifying" height={500} width={500}/>
      {userData && <AddUser {...userData} />}
    </div>
  );
}
