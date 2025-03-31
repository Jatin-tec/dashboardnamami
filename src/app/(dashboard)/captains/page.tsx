import Captains from './Captains';
import { getCaptains } from './server/actions/captain';

export default async function Page() {
    const captains = await getCaptains();
    return <Captains captains={captains}/>
}
