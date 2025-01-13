import React from 'react';
import { Dialog, DialogTitle, DialogContent, Table, TableBody, TableRow, TableCell } from '@mui/material';

const BookingComponent = ({ open, onClose, expert }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Book Appointment with {expert?.name}</DialogTitle>
      <DialogContent>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>Monday</TableCell>
              <TableCell>9:00 AM, 10:00 AM</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </DialogContent>
    </Dialog>
  );
};

export default BookingComponent;
