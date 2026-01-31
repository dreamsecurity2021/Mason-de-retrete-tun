import React, { useMemo, useState } from "react";
import {
  AppBar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Divider,
  Stack,
  IconButton,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import CameraAltOutlinedIcon from "@mui/icons-material/CameraAltOutlined";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";

const initialCameras = [
  {
    id: "CAM-01",
    location: "بوابة المواقف الشمالية",
    rtsp: "rtsp://192.168.10.20/stream1",
    status: "متصل",
  },
  {
    id: "CAM-02",
    location: "المدخل الرئيسي - الدور الأرضي",
    rtsp: "rtsp://192.168.10.21/stream1",
    status: "متصل",
  },
  {
    id: "CAM-03",
    location: "مواقف الزوار",
    rtsp: "rtsp://192.168.10.22/stream2",
    status: "تنبيه",
  },
];

const initialViolations = [
  {
    plate: "تونس 2345",
    location: "مواقف الزوار",
    time: "10:12 AM",
    duration: "45 دقيقة",
    image: "https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=900&q=80",
    status: "تم إرسال التنبيه",
  },
  {
    plate: "1234 TU",
    location: "بوابة المواقف الشمالية",
    time: "09:41 AM",
    duration: "32 دقيقة",
    image: "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=900&q=80",
    status: "بانتظار الإرسال",
  },
];

const initialAlerts = [
  {
    channel: "واتساب",
    recipient: "+216 25 987 654",
    lastSent: "اليوم 09:41",
    status: "ناجح",
  },
  {
    channel: "Tyexmeboot",
    recipient: "Webhook: https://api.tyexmeboot.io/send",
    lastSent: "اليوم 09:38",
    status: "ناجح",
  },
];

const App = () => {
  const [allowedMinutes, setAllowedMinutes] = useState("30");
  const [alertWindow, setAlertWindow] = useState("08:00 - 20:00");
  const [webhookUrl, setWebhookUrl] = useState("https://api.tyexmeboot.io/send");
  const [whatsAppNumber, setWhatsAppNumber] = useState("+216 25 987 654");

  const summary = useMemo(
    () => [
      {
        title: "الكاميرات النشطة",
        value: initialCameras.length,
        icon: <CameraAltOutlinedIcon />,
      },
      {
        title: "مخالفات اليوم",
        value: initialViolations.length,
        icon: <NotificationsActiveIcon />,
      },
      {
        title: "زمن الوقوف المسموح",
        value: `${allowedMinutes} دقيقة`,
        icon: <AccessTimeIcon />,
      },
    ],
    [allowedMinutes]
  );

  return (
    <Box dir="rtl" sx={{ minHeight: "100vh", backgroundColor: "#f8fafc" }}>
      <AppBar position="static" color="transparent" elevation={0} sx={{ borderBottom: "1px solid #e2e8f0" }}>
        <Toolbar>
          <Stack direction="row" spacing={1} alignItems="center">
            <LocationOnOutlinedIcon color="primary" />
            <Typography variant="h6" fontWeight={700}>
              لوحة متابعة الوقوف الخاطئ
            </Typography>
          </Stack>
          <Box sx={{ flexGrow: 1 }} />
          <Button variant="contained" color="primary">
            تفعيل الكشف الفوري
          </Button>
        </Toolbar>
      </AppBar>

      <Container sx={{ py: 4 }} maxWidth="lg">
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
            gap: 3,
          }}
        >
          {summary.map((card) => (
            <Card key={card.title} sx={{ height: "100%" }}>
              <CardContent>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: "12px",
                      backgroundColor: "#e0f2fe",
                      color: "#0284c7",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {card.icon}
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      {card.title}
                    </Typography>
                    <Typography variant="h5" fontWeight={700}>
                      {card.value}
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          ))}
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "repeat(12, 1fr)" },
            gap: 3,
            mt: 3,
          }}
        >
          <Box sx={{ gridColumn: { xs: "1 / -1", md: "1 / span 5" } }}>
            <Card>
              <CardContent>
                <Typography variant="h6" fontWeight={700} gutterBottom>
                  إعدادات التنبيه عبر واتساب و Tyexmeboot
                </Typography>
                <Stack spacing={2}>
                  <TextField
                    label="رقم واتساب لاستقبال التنبيه"
                    value={whatsAppNumber}
                    onChange={(event) => setWhatsAppNumber(event.target.value)}
                    InputProps={{
                      startAdornment: (
                        <Box sx={{ ml: 1, display: "flex" }}>
                          <WhatsAppIcon color="success" />
                        </Box>
                      ),
                    }}
                    fullWidth
                  />
                  <TextField
                    label="رابط Webhook الخاص بـ Tyexmeboot"
                    value={webhookUrl}
                    onChange={(event) => setWebhookUrl(event.target.value)}
                    fullWidth
                  />
                  <TextField
                    label="الوقت المسموح للوقوف (بالدقائق)"
                    value={allowedMinutes}
                    onChange={(event) => setAllowedMinutes(event.target.value)}
                    fullWidth
                  />
                  <TextField
                    label="نافذة إرسال التنبيهات"
                    value={alertWindow}
                    onChange={(event) => setAlertWindow(event.target.value)}
                    fullWidth
                  />
                  <Button variant="contained">حفظ الإعدادات</Button>
                </Stack>
              </CardContent>
            </Card>
          </Box>

          <Box sx={{ gridColumn: { xs: "1 / -1", md: "6 / span 7" } }}>
            <Card>
              <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography variant="h6" fontWeight={700}>
                    الكاميرات المرتبطة (RTSP)
                  </Typography>
                  <Button variant="outlined">إضافة كاميرا</Button>
                </Stack>
                <Divider sx={{ my: 2 }} />
                <Stack spacing={2}>
                  {initialCameras.map((camera) => (
                    <Box
                      key={camera.id}
                      sx={{
                        border: "1px solid #e2e8f0",
                        borderRadius: 2,
                        p: 2,
                        display: "flex",
                        flexDirection: "column",
                        gap: 1,
                      }}
                    >
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Typography fontWeight={600}>{camera.location}</Typography>
                        <Chip
                          label={camera.status}
                          color={camera.status === "متصل" ? "success" : "warning"}
                          size="small"
                        />
                      </Stack>
                      <Typography variant="body2" color="text.secondary">
                        معرف الكاميرا: {camera.id}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        رابط البث: {camera.rtsp}
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              </CardContent>
            </Card>
          </Box>
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "repeat(12, 1fr)" },
            gap: 3,
            mt: 3,
          }}
        >
          <Box sx={{ gridColumn: { xs: "1 / -1", md: "1 / span 7" } }}>
            <Card>
              <CardContent>
                <Typography variant="h6" fontWeight={700} gutterBottom>
                  آخر المخالفات مع صورة السيارة
                </Typography>
                <Stack spacing={2}>
                  {initialViolations.map((violation) => (
                    <Box
                      key={`${violation.plate}-${violation.time}`}
                      sx={{
                        border: "1px solid #e2e8f0",
                        borderRadius: 2,
                        p: 2,
                        display: "grid",
                        gridTemplateColumns: "120px 1fr",
                        gap: 2,
                        alignItems: "center",
                      }}
                    >
                      <Box
                        component="img"
                        src={violation.image}
                        alt={`صورة مخالفة ${violation.plate}`}
                        sx={{
                          width: 120,
                          height: 90,
                          borderRadius: 1,
                          objectFit: "cover",
                        }}
                      />
                      <Stack spacing={0.5}>
                        <Typography fontWeight={600}>{violation.plate}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          الموقع: {violation.location}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          وقت الرصد: {violation.time} · مدة الوقوف: {violation.duration}
                        </Typography>
                        <Chip label={violation.status} color="info" size="small" sx={{ width: "fit-content" }} />
                      </Stack>
                    </Box>
                  ))}
                </Stack>
              </CardContent>
            </Card>
          </Box>

          <Box sx={{ gridColumn: { xs: "1 / -1", md: "8 / span 5" } }}>
            <Card>
              <CardContent>
                <Typography variant="h6" fontWeight={700} gutterBottom>
                  سجل إرسال التنبيهات
                </Typography>
                <Stack spacing={2}>
                  {initialAlerts.map((alert) => (
                    <Box
                      key={`${alert.channel}-${alert.recipient}`}
                      sx={{
                        border: "1px solid #e2e8f0",
                        borderRadius: 2,
                        p: 2,
                        display: "flex",
                        flexDirection: "column",
                        gap: 1,
                      }}
                    >
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Typography fontWeight={600}>{alert.channel}</Typography>
                        <Chip label={alert.status} color="success" size="small" />
                      </Stack>
                      <Typography variant="body2" color="text.secondary">
                        المستلم: {alert.recipient}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        آخر إرسال: {alert.lastSent}
                      </Typography>
                    </Box>
                  ))}
                </Stack>
                <Divider sx={{ my: 2 }} />
                <Stack direction="row" spacing={1} alignItems="center">
                  <IconButton color="primary">
                    <NotificationsActiveIcon />
                  </IconButton>
                  <Typography variant="body2" color="text.secondary">
                    يتم إرسال التنبيه تلقائياً عند تجاوز الوقت المسموح وإرفاق صورة السيارة.
                  </Typography>
                </Stack>
              </CardContent>
            </Card>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default App;
