import Captains from './Captains';
import { getCaptains } from './server/actions/captain';

export default async function Page() {
    const captains = await getCaptains();
    console.log(captains, 'captains');
    return <Captains captains={captains.data}/>
}
