import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from "@mui/material";
import { useState } from "react";
import { supabase } from "../../supabase";

const DialogBox = ({ value }) => {

    async function deleteRow(){
        try{
            const {error} = await supabase
            .from(value.table)
            .delete()
            .eq('pk',value.pk)
            if(error){
                console.log(error)
            }else{
                value.refresh();
                value.close();
            }
        }catch(e){
            console.log(e);
        }
    }
    return (
        <Dialog
            open={value.open}
            onClose={value.close}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">
                {"Confirmation"}
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    <b style={{ color: 'black', padding: '0px 20px' }}>Do you Want to Delete?</b>
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={value.close}>Cancel</Button>
                <Button onClick={deleteRow} autoFocus sx={{ color: 'red' }}>
                    Delete
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default DialogBox;