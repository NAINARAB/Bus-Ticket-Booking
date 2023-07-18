import { supabase } from "../../supabase";

async function pushActivity(arg){
    try {
        const {data} = await supabase
        .from('activity')
        .insert([{
            'event': arg
        }])
        if(data){}
    }catch(e){}
}

export default pushActivity;