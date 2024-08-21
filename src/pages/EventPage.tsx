import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, Slide, Typography } from "@mui/material";
import Header from "../components/HeaderComponent";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  apiGetEventById,
  apiJoinEvent,
  apiWithdrawEvent,
} from "../api/SpentApiManager";
import { Event, User } from "../types/types";
import GroupIcon from "@mui/icons-material/Group";
import CircularProgress from "@mui/material/CircularProgress";
import React from "react";
import { TransitionProps } from "@mui/material/transitions";
import './EventPage.css'

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function EventPage() {
  const { id } = useParams();
  const [event, setEvent] = useState<Event | null>(null);
  const username = localStorage.getItem("username") as string;
  

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const isUsernameInEventParticipants = (
    event: Event,
    username: string
  ): boolean => {
    return event.eventParticipants.some(
      (participant) => participant.username === username
    );
  };

  const isParticipant =
    event && localStorage.getItem("username")
      ? isUsernameInEventParticipants(event, username)
      : false;

  useEffect(() => {
    if (id) {
      apiGetEventById(id).then((event) => {
        setEvent(event);
      });
    }
  }, [id]);
  if (!event)
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress color="inherit" />
      </Box>
    );

  const handleJoin = () => {
    const newUser: User = {
      id: "newUserId",
      username: username,
      email: "default@example.com",
      firstName: "Default",
      rating: 0,
      eventsCreated: [],
      joinedEvents: [],
    };

    const updatedEvent = {
      ...event,
      eventParticipants: [...event.eventParticipants, newUser],
    };

    setEvent(updatedEvent);
    apiJoinEvent(id as string);
  };

  const handleWithdraw = () => {
    const updatedEvent = {
      ...event,
      eventParticipants: event.eventParticipants.filter(
        (participant) => participant.username !== username
      ),
    };

    setEvent(updatedEvent);
    apiWithdrawEvent(id as string);
  };

  return (
    <>
      <Header />
      <Box sx={{ padding: "20px" }}>
        <Grid container spacing={6}>
          <Grid item xs={12} md={6}>
            <Box>
              <Typography variant="h3" fontWeight="bold">
                {event.title}
              </Typography>
              <React.Fragment>
                <Typography variant="h5" onClick={handleClickOpen}>
                  <span className="sportName">
                    {event.sport.sportName}
                  </span>
                </Typography>
                <Dialog
                  open={open}
                  TransitionComponent={Transition}
                  keepMounted
                  onClose={handleClose}
                  aria-describedby="alert-dialog-slide-description"
                >
                  <DialogTitle> {event.sport.sportName}</DialogTitle>
                  <DialogContent>
                    <DialogContentText id="alert-dialog-slide-description">
                      {event.sport.description}
                    </DialogContentText>
                  </DialogContent>
                </Dialog>
              </React.Fragment>

              <Typography variant="body1">
                {event.description}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Box
                sx={{
                  width: "150px",
                  height: "150px",
                  borderRadius: "10px",
                  backgroundColor: "#e0e0e0",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {/* Add your map image here */}
              </Box>
              <Typography variant="body1" mt={2}>
                {event.address}
              </Typography>
              <Typography variant="h5" fontWeight="bold" mt={1}>
                {event.date}
              </Typography>
              <Typography variant="body2" sx={{ mb: 0.5, mt: 0.5 }}>
                {event.startTime.substring(0, 5)} - {event.endTime.substring(0, 5)}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6} md={4} mt={3}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Box>
                <Typography variant="h5">
                  {isParticipant ? (
                    <Button
                      onClick={handleWithdraw}
                      variant="contained"
                      color="error"
                      sx={{
                        width: "150px",
                        height: "50px",
                        borderRadius: "10px",
                        backgroundColor: "red",
                      }}
                    >
                      Withdraw
                    </Button>
                  ) : (
                    <Button
                      onClick={handleJoin}
                      variant="contained"
                      color="success"
                      sx={{
                        width: "150px",
                        height: "50px",
                        borderRadius: "10px",
                        backgroundColor: "#4CAF50",
                      }}
                    >
                      Join
                    </Button>
                  )}
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Typography variant="h6" fontWeight="bold">
                  {event.eventParticipants.length} / {event.numParticipants}
                </Typography>
                <Grid item xs={6} md={3} mt={2.5}>
                  <Box>
                    <GroupIcon sx={{ marginBottom: 2, marginLeft: 1 }} />
                  </Box>
                </Grid>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}

export default EventPage;
