// RegisterCamp.jsx
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";

const nepalData = {
  'Koshi Province': {
    Taplejung: ['Taplejung', 'Phungling', 'Sidingba'],
    Sankhuwasabha: ['Chainpur', 'Khandbari', 'Madi'],
    Solukhumbu: ['Salleri', 'Phaplu', 'Namche'],
    Okhaldhunga: ['Okhaldhunga', 'Siddhicharan'],
    Khotang: ['Diktel', 'Halesi', 'Khotehang'],
    Bhojpur: ['Bhojpur', 'Shadananda'],
    Dhankuta: ['Dhankuta', 'Pakhribas'],
    Terhathum: ['Myanglung', 'Laligurans'],
    Ilam: ['Ilam', 'Mai', 'Suryodaya'],
    Jhapa: ['Birtamod', 'Bhadrapur', 'Mechinagar', 'Damak', 'Kankai'],
    Morang: ['Biratnagar', 'Sundar Haraicha', 'Urlabari', 'Pathari'],
    Sunsari: ['Dharan', 'Itahari', 'Inaruwa', 'Duhabi'],
  },
  'Madhesh Province': {
    Saptari: ['Rajbiraj', 'Kanchanrup', 'Shambhunath'],
    Siraha: ['Lahan', 'Siraha', 'Golbazar'],
    Dhanusha: ['Janakpur', 'Dhalkebar', 'Mithila'],
    Mahottari: ['Jaleshwar', 'Bardibas', 'Gaur'],
    Sarlahi: ['Malangwa', 'Haripur', 'Ishworpur'],
    Rautahat: ['Gaur', 'Chandrapur', 'Brindaban'],
    Bara: ['Kalaiya', 'Simraungadh', 'Nijgadh'],
    Parsa: ['Birgunj', 'Pokhariya', 'Bahudarmai'],
  },
  'Bagmati Province': {
    Kathmandu: ['Kathmandu', 'Kirtipur', 'Kageshwori', 'Tokha', 'Budhanilkantha'],
    Lalitpur: ['Lalitpur', 'Godawari', 'Mahalaxmi', 'Konjyosom'],
    Bhaktapur: ['Bhaktapur', 'Changunarayan', 'Madhyapur Thimi', 'Suryabinayak'],
    Kavrepalanchok: ['Dhulikhel', 'Banepa', 'Panauti', 'Namobuddha'],
    Sindhupalchok: ['Chautara', 'Bahrabise', 'Melamchi'],
    Dolakha: ['Charikot', 'Jiri', 'Bigu'],
    Ramechhap: ['Manthali', 'Ramechhap', 'Umakunda'],
    Sindhuli: ['Sindhuli', 'Kamalamai', 'Dudhauli'],
    Makwanpur: ['Hetauda', 'Thaha', 'Raksirang'],
    Rasuwa: ['Rasuwa', 'Kalika', 'Gosaikunda'],
    Nuwakot: ['Bidur', 'Belkotgadhi', 'Suryagadhi'],
    Dhading: ['Nilkantha', 'Dhading', 'Jwalamukhi'],
    Chitwan: ['Bharatpur', 'Ratnanagar', 'Madi', 'Rapti'],
  },
  'Gandaki Province': {
    Kaski: ['Pokhara', 'Annapurna', 'Machhapuchchhre', 'Rupa'],
    Tanahun: ['Damauli', 'Bhanu', 'Shuklagandaki'],
    Syangja: ['Syangja', 'Galyang', 'Waling'],
    Lamjung: ['Besishahar', 'Sundarbazar', 'Rainas'],
    Gorkha: ['Gorkha', 'Palungtar', 'Barpak Sulikot'],
    Manang: ['Chame', 'Narphu', 'Narpabhumisame'],
    Mustang: ['Jomsom', 'Lomanthang', 'Thasang'],
    Myagdi: ['Baglung', 'Beni', 'Mangala'],
    Baglung: ['Baglung', 'Dhorpatan', 'Jaimini'],
    Parbat: ['Kushma', 'Phalewas', 'Modi'],
    Nawalpur: ['Kawasoti', 'Bulingtar', 'Madhyabindu'],
  },
  'Lumbini Province': {
    Rupandehi: ['Butwal', 'Siddharthanagar', 'Tilottama', 'Sainamaina'],
    Kapilvastu: ['Kapilvastu', 'Banganga', 'Buddhabhumi'],
    Arghakhanchi: ['Sandhikharka', 'Shitganga', 'Bhumikasthan'],
    Gulmi: ['Tamghas', 'Musikot', 'Resunga'],
    Palpa: ['Tansen', 'Rampur', 'Rambha'],
    'Nawalparasi West': ['Sunwal', 'Palhinandan', 'Pratappur'],
    Dang: ['Tulsipur', 'Ghorahi', 'Lamahi'],
    Banke: ['Nepalgunj', 'Narainapur', 'Rapti Sonari'],
    Bardiya: ['Gulariya', 'Thakurbaba', 'Rajapur'],
    Pyuthan: ['Pyuthan', 'Sworgadwary', 'Mallarani'],
    Rolpa: ['Rolpa', 'Runtigadhi', 'Lungri'],
  },
  'Karnali Province': {
    Surkhet: ['Birendranagar', 'Bheriganga', 'Lekbesi'],
    Dailekh: ['Narayan', 'Dullu', 'Chamunda Bindrasaini'],
    Jajarkot: ['Bheri', 'Chhedagad', 'Barekot'],
    Dolpa: ['Thulibheri', 'Tripurasundari', 'Dolpo Buddha'],
    Humla: ['Simkot', 'Chankheli', 'Sarkegad'],
    Jumla: ['Chandannath', 'Tatopani', 'Sinja'],
    Kalikot: ['Khandachakra', 'Pachaljaharakot', 'Tilagufa'],
    Mugu: ['Khatyad', 'Mugum Karmarong', 'Chhayanath Rara'],
    Salyan: ['Bangad Kupinde', 'Sharada', 'Kapurkot'],
    'Rukum West': ['Musikot', 'Aathbiskot', 'Sanibhumi'],
  },
  'Sudurpashchim Province': {
    Kailali: ['Dhangadhi', 'Tikapur', 'Godawari', 'Bhajani'],
    Kanchanpur: ['Bhimdatta', 'Shuklaphanta', 'Belauri'],
    Dadeldhura: ['Amargadhi', 'Aalital', 'Navadurga'],
    Doti: ['Dipayal Silgadhi', 'Shikhar', 'Purbichauki'],
    Achham: ['Mangalsen', 'Chaurpati', 'Ramaroshan'],
    Bajura: ['Budhinanda', 'Tribeni', 'Himali'],
    Bajhang: ['Jayaprithvi', 'Bungal', 'Thalara'],
    Baitadi: ['Dasharathchand', 'Patan', 'Sigas'],
    Darchula: ['Darchula', 'Shailyashikhar', 'Lekam'],
  },
};
const schema = yup.object().shape({
  name: yup.string().required("Name is required"),
  dateOfBirth: yup
    .date('enter valid date')
    .required("Date of Birth is required")
    .max(new Date(), "Date of Birth cannot be in the future"),
  gender: yup.string().oneOf(["male","female","other"]).required("Gender is required"),
  bloodGroup: yup.string().oneOf(["A+","A-","B+","B-","AB+","AB-","O+","O-"]).required("Blood group is required"),
  phoneNumber: yup.string().required("Phone number is required"),
  email: yup.string().email("Invalid email").required("email is required"),
  city: yup.string().required("City is required"),
  district: yup.string().required("District is required"),
  province: yup.string().required("Province is required"),
 weight: yup
  .number()
  .typeError("Weight must be a number")
  .required("Weight is required")
  .min(45, "Minimum weight should be 45kg to donate blood"),
  lastDonated: yup
  .date()
  .nullable()
  .max(new Date(), "Invalid date"),
  previousDonor: yup.boolean(),
  recentFever: yup.boolean(),
  recentTattoo: yup.boolean(),
  alcoholLast24h: yup.boolean(),
  
  consent: yup.boolean().oneOf([true], "You must give consent"),
});

export default function RegisterCamp({ campId, donorProfile, onClose }) {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: donorProfile?.userName || "",
      dateOfBirth: donorProfile?.dateOfBirth?.split("T")[0] || "",
      gender: donorProfile?.gender || "",
      bloodGroup: donorProfile?.bloodGroup || "",
      phoneNumber: donorProfile?.phoneNumber || "",
      email: donorProfile?.email || "",
      city: donorProfile?.city || "",
      district: donorProfile?.district || "",
      province: donorProfile?.province || "",
      consent: false,
    },
    resolver: yupResolver(schema),
  });

   const watchProvince = watch('province');
  const watchDistrict = watch('district');
  const previousDonor = watch("previousDonor");

  const onSubmit = async (data) => {
     if (!donorProfile?._id) {
      toast.error("Donor profile not loaded. Cannot register.");
      return;
    }
    try {
       console.log('registered data',data);
      await axios.post(
        "http://localhost:8000/dashboard-donor/register-camp",
        {
          ...data,
        donorId: donorProfile?._id,
          campId,
           lastDonated: data.lastDonated || null,
           previousDonor: !!data.previousDonor,
    recentFever: !!data.recentFever,
    recentTattoo: !!data.recentTattoo,
    alcoholLast24h: !!data.alcoholLast24h,
        },
        { withCredentials: true }
      );
       toast.success(res.data.message || "Successfully registered for the camp!");

      onClose();
      console.log(data);
    } catch (err) {
      console.error(err);
      const errorMessage =err?.response?.data?.message || "Registration failed. Try again.";
    toast.error(errorMessage);
    }
  };
  return (
    <div className="fixed md:absolute   top-120 inset-0 w-full  flex items-center justify-center z-50">
      <Toaster />
      <div className=" rounded-xl shadow-xl p-6 w-full md:w-200 bg-red-50 border border-red-500 relative">
        <div className="w-full ">

        
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-red-600 cursor-pointer hover:bg-red-200 rounded-full font-extrabold p-2"
        >
          ✕
        </button>
        <h2 className="text-2xl font-bold mb-4 text-red-600">Register for Camp</h2>


        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Name */}
          <div>
           

            
            <label className="font-medium">Full Name</label>
            <input
              {...register("name")}
              className="w-full border border-red-600 focus:border-red-600 focus:border-2 outline-red-500 p-2 rounded"
            />
            {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
          </div>

          {/* Date of Birth */}
          <div>
            <label className="font-medium">Date of Birth</label>
            <input
              type="date"
              {...register("dateOfBirth")}
              className="w-full border  border-red-600 focus:border-red-600 focus:border-2 outline-red-500 p-2 rounded"
            />
            {errors.dateOfBirth && <p className="text-red-500 text-sm">{errors.dateOfBirth.message}</p>}
          </div>

          {/* Gender */}
          <div>
            <label className="font-medium">Gender</label>
            <select {...register("gender")} className="w-full border  border-red-600 focus:border-red-600 focus:border-2 outline-red-500 p-2 rounded">
              <option value="">Select</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
            {errors.gender && <p className="text-red-500 text-sm">{errors.gender.message}</p>}
          </div>

          {/* Blood Group */}
          <div>
            <label className="font-medium">Blood Group</label>
            <select {...register("bloodGroup")} className="w-full  border-red-600 focus:border-red-600 focus:border-2 outline-red-500 border p-2 rounded">
              <option value="">Select</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
            </select>
            {errors.bloodGroup && <p className="text-red-500 text-sm">{errors.bloodGroup.message}</p>}
          </div>

          {/* Phone */}
          <div>
            <label className="font-medium">Phone Number</label>
            <input {...register("phoneNumber")} className="w-full border  border-red-600 focus:border-red-600 focus:border-2 outline-red-500 p-2 rounded" />
            {errors.phoneNumber && <p className="text-red-500 text-sm">{errors.phoneNumber.message}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="font-medium">Email</label>
            <input type="email" {...register("email")} className="w-full border  border-red-600 focus:border-red-600 focus:border-2 outline-red-500 p-2 rounded" />
            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
          </div>

         {/* Address */}
        <label className="block text-md font-medium text-blue-900">Address*</label>

        {/* Province */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Province*</label>
          <select
            {...register('province')}
            onChange={(e) => {
              setValue('province', e.target.value);
              setValue('district', '');
              setValue('city', '');
            }}
            className="w-full border border-red-600 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600"
          >
            <option value="">Select Province</option>
            {Object.keys(nepalData).map((prov) => (
              <option key={prov} value={prov}>{prov}</option>
            ))}
          </select>
          <p className="text-red-500 text-xs mt-1">{errors.province?.message}</p>
        </div>

        {/* District */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">District*</label>
          <select
            {...register('district')}
            onChange={(e) => {
              setValue('district', e.target.value);
              setValue('city', '');
            }}
            disabled={!watchProvince}
            className="w-full border border-red-600 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600 disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
            <option value="">Select District</option>
            {(nepalData[watchProvince] ? Object.keys(nepalData[watchProvince]) : []).map((dist) => (
              <option key={dist} value={dist}>{dist}</option>
            ))}
          </select>
          <p className="text-red-500 text-xs mt-1">{errors.district?.message}</p>
        </div>

        {/* City */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">City / Municipality*</label>
          <select
            {...register('city')}
            disabled={!watchDistrict}
            className="w-full border border-red-600 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600 disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
            <option value="">Select City</option>
            {(nepalData[watchProvince]?.[watchDistrict] || []).map((city) => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
          <p className="text-red-500 text-xs mt-1">{errors.city?.message}</p>
        </div>

         <div>
           

            
            <label className="block text-sm font-medium text-gray-700 mb-1">Weight</label>
            <input
              {...register("weight")}
              className="w-full border border-red-600 focus:border-red-600 focus:border-2 outline-red-500 p-2 rounded"
            />
            {errors.weight && <p className="text-red-500 text-sm">{errors.weight.message}</p>}
          </div>

          
      
<div className="flex items-center gap-2">
  <input type="checkbox" {...register("previousDonor")} id="previousDonor" />
  <label htmlFor="previousDonor" className=" text-blue-600">Have you donated blood previously?</label>
</div>


{previousDonor && (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">Last Donated Time</label>
    <input
      type="date"
      {...register("lastDonated")}
      className="w-full border border-red-600 focus:border-red-600 focus:border-2 outline-red-500 p-2 rounded"
    />
    {errors.lastDonated && (
      <p className="text-red-500 text-sm">{errors.lastDonated.message}</p>
    )}
  </div>
)}


{/* Recent Fever */}
<div className="flex items-center gap-2">
  <input type="checkbox" {...register("recentFever")} />
  <span className="text-blue-600">Have you had a fever in the last 7 days?</span>
</div>

{/* Recent Tattoo */}
<div className="flex items-center gap-2">
  <input type="checkbox" {...register("recentTattoo")} />
  <span className="text-blue-600">Have you gotten a tattoo in the last 6 months?</span>
</div>

{/* Alcohol in Last 24 Hours */}
<div className="flex items-center gap-2">
  <input type="checkbox" {...register("alcoholLast24h")} />
  <span className="text-blue-600">Have you consumed alcohol in the last 24 hours?</span>
</div>








          {/* Consent */}
          <div className="flex items-center gap-2">
            <input type="checkbox" {...register("consent")} />
            <span className="font-medium text-black">I consent to donate blood and allow storing my data for this camp.</span>
          </div>
          {errors.consent && <p className="text-red-500 text-sm">{errors.consent.message}</p>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-red-600 text-white font-bold py-2 rounded hover:bg-red-700 transition"
          >
            {isSubmitting ? "Registering..." : "Register"}
          </button>
        </form>
        </div>
      </div>
    </div>
  );
}