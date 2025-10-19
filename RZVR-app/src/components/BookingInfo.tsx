import { FunctionDB } from './FunctionDB';
import { ReactEmail } from './ReactEmail';
import { FunctionReSend } from './FunctionReSend';
import { FunctionConfirmationOfBooking } from './FunctionConfirmationOfBooking';

export function BookingInfo() {
    return (
        <div className="bookinginfo">
            <FunctionDB />
            <ReactEmail />
            <FunctionReSend />
            <FunctionConfirmationOfBooking />
        </div>
    );
}