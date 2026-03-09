export const LEADERSHIP = [
  { name: "Kuya Ivan", role: "Head", desc: "Overall leadership and supervision. Final approval on major decisions.", icon: "👑" },
  { name: "Ange", role: "Treasurer", desc: "Oversees all church finances, collects contributions, records offerings, reviews financial reports, budget monitoring.", icon: "💰" },
  { name: "Ced", role: "Events Dept Head / Engagement", desc: "Plans church events, monitors attendance, follows up visitors.", icon: "🎉" },
  { name: "Pipper", role: "Events Dept", desc: "Assists in planning and organizing church events.", icon: "🎉" },
  { name: "Precious", role: "Performance Dept Head", desc: "Prepares performances and presentations, manages rehearsals.", icon: "🎶" },
  { name: "Krislene", role: "Performance Dept", desc: "Member of the Performance Dept — worship presentations and rehearsals.", icon: "🎶" },
  { name: "Jam", role: "Secretary", desc: "Records meeting minutes, posts announcements, maintains member records.", icon: "📝" },
  { name: "Tine", role: "Secretary", desc: "Assists in secretarial duties — events coordination and document management.", icon: "📝" },
];

export const MINISTRIES = [
  { name: "Worship Ministry",    icon: "🎵", desc: "Leading the congregation in heartfelt praise and worship to God." },
  { name: "Youth Ministry",      icon: "🌟", desc: "Nurturing the next generation in faith and discipleship." },
  { name: "Children's Ministry", icon: "🌈", desc: "Teaching children the love of God through fun and engaging activities." },
  { name: "Prayer Ministry",     icon: "🙏", desc: "Covering the church and community in intercessory prayer." },
  { name: "Outreach Ministry",   icon: "❤️", desc: "Spreading the Gospel and serving the community with love." },
  { name: "Performance Dept",    icon: "🎭", desc: "Creative presentations and performances that glorify God." },
];

export const EVENTS = [
  { date: "Mar 9",  title: "Sunday Worship Service",  time: "9:00 AM",  type: "worship"  },
  { date: "Mar 12", title: "Midweek Prayer Meeting",   time: "7:00 PM",  type: "prayer"   },
  { date: "Mar 16", title: "Youth Fellowship Night",   time: "6:00 PM",  type: "youth"    },
  { date: "Mar 23", title: "Family Day Celebration",   time: "10:00 AM", type: "event"    },
  { date: "Mar 30", title: "Monthly Devotion Sharing", time: "3:00 PM",  type: "devotion" },
  { date: "Apr 6",  title: "Easter Sunday Special",    time: "8:00 AM",  type: "worship"  },
];

export const SONGS = [
  { title: "Rock of My Salvation",      author: "D2 Worship Team",     category: "Praise",   youtube: "https://www.youtube.com/watch?v=RgjrXcQFaHs" },
  { title: "Sa Iyo Ang Papuri",         author: "D2 Worship Team",     category: "Worship",  youtube: "https://www.youtube.com/watch?v=LMnN7DHuMg0" },
  { title: "Ikaw Ang Aming Bato",       author: "D2 Worship Team",     category: "Hymn",     youtube: "https://www.youtube.com/watch?v=Tq9PbHTSWD0" },
  { title: "Foundation of My Life",     author: "D2 Worship Team",     category: "Praise",   youtube: "https://www.youtube.com/watch?v=RgjrXcQFaHs" },
  { title: "How Great Is Our God",      author: "Chris Tomlin",        category: "Worship",  youtube: "https://www.youtube.com/watch?v=KBD18rsVJHk" },
  { title: "Blessed Be Your Name",      author: "Matt Redman",         category: "Praise",   youtube: "https://www.youtube.com/watch?v=VZBXO8qJuN4" },
  { title: "10,000 Reasons (Bless the Lord)", author: "Matt Redman",  category: "Worship",  youtube: "https://www.youtube.com/watch?v=DXDGE_lRI0E" },
  { title: "Way Maker",                 author: "Sinach",              category: "Praise",   youtube: "https://www.youtube.com/watch?v=iom4PNq_gMg" },
];

export const NAV_ITEMS = ["Home","About","Ministries","Events","Media","Give","Prayer","Login"];

export const ROLES = [
  { id: "head",        label: "Head",            icon: "👑", color: "#C9A84C" },
  { id: "treasurer",   label: "Treasurer",        icon: "💰", color: "#7BE0B0" },
  { id: "events",      label: "Events Dept",      icon: "🎉", color: "#E07B7B" },
  { id: "performance", label: "Performance Dept", icon: "🎶", color: "#B07BE0" },
  { id: "secretary",   label: "Secretary",        icon: "📝", color: "#E0B07B" },
  { id: "engagement",  label: "Engagement",       icon: "🤝", color: "#7BE0C8" },
  { id: "member",      label: "Church Member",    icon: "👤", color: "#9A9080" },
];

export const ROLE_ACCESS = {
  head:        ["Dashboard Overview","Manage Members","Manage Events","Finance","Post Announcements","Attendance Logs","Export Reports","System Settings","Upload Documents","Rehearsal Schedule","Practice Materials","Devotion Submission"],
  treasurer:   ["Donation Records","Financial Reports","Monthly Budget","Export Reports","Announcements","Rehearsal Schedule","Practice Materials","Devotion Submission"],
  events:      ["Manage Events","Upcoming Events","Post Announcements","Announcements","Rehearsal Schedule","Practice Materials","Devotion Submission"],
  performance: ["Song List","Rehearsal Schedule","Practice Materials","Announcements","Devotion Submission"],
  secretary:   ["Member Records","Post Announcements","Upload Documents","Rehearsal Schedule","Practice Materials","Devotion Submission"],
  engagement:  ["Attendance Monitoring","Visitor Follow-up","Member List","Announcements","Rehearsal Schedule","Practice Materials","Devotion Submission"],
  member:      ["My Profile","Devotion Submission","View Events","Announcements"],
};

export const ACCOUNTS = [
  {
    username: "ivan", password: "head2026", role: "head",
    fullName: "Kuya Ivan", contact: "09XX-XXX-0001",
    address: "Pasig City", birthday: "Jan 1, 1990",
    joinedDate: "January 2024", bio: "Head and overall leader of D2 Church.",
  },
  {
    username: "ange", password: "treasurer2026", role: "treasurer",
    fullName: "Ange", contact: "09XX-XXX-0002",
    address: "Pasig City", birthday: "Feb 14, 1995",
    joinedDate: "January 2024", bio: "Treasurer overseeing church finances.",
  },
  // {
  //   username: "angie", password: "finance2026", role: "treasurer",
  //   fullName: "Angie", contact: "09XX-XXX-0003",
  //   address: "Pasig City", birthday: "Mar 3, 1996",
  //   joinedDate: "January 2024", bio: "Financial Dept — records contributions and offerings.",
  // },
  {
    username: "ced", password: "events2026", role: "events",
    fullName: "Ced", contact: "09XX-XXX-0004",
    address: "Pasig City", birthday: "Apr 10, 1994",
    joinedDate: "February 2024", bio: "Events Dept Head and Engagement Officer.",
  },
  {
    username: "precious", password: "perf2026", role: "performance",
    fullName: "Precious", contact: "09XX-XXX-0005",
    address: "Pasig City", birthday: "May 5, 1997",
    joinedDate: "February 2024", bio: "Performance Dept Head — worship and presentations.",
  },
  {
    username: "jam", password: "secretary2026", role: "secretary",
    fullName: "Jam", contact: "09XX-XXX-0006",
    address: "Pasig City", birthday: "Jun 20, 1998",
    joinedDate: "March 2024", bio: "Secretary — records minutes and manages documents.",
  },
  {
    username: "pipper", password: "pipper2026", role: "events",
    fullName: "Pipper", contact: "09XX-XXX-0007",
    address: "Pasig City", birthday: "—",
    joinedDate: "March 2024", bio: "Events Dept member.",
  },
  {
    username: "tine", password: "tine2026", role: "secretary",
    fullName: "Tine", contact: "09XX-XXX-0008",
    address: "Pasig City", birthday: "—",
    joinedDate: "March 2024", bio: "Events and Secretary Dept member.",
  },
  {
    username: "krislene", password: "krislene2026", role: "performance",
    fullName: "Krislene", contact: "09XX-XXX-0009",
    address: "Pasig City", birthday: "—",
    joinedDate: "April 2024", bio: "Performance Dept member.",
  },
  {
    username: "ariane", password: "ariane2026", role: "treasurer",
    fullName: "Ariane", contact: "09XX-XXX-0010",
    address: "Pasig City", birthday: "—",
    joinedDate: "April 2024", bio: "Financial Dept member.",
  },
  {
    username: "member", password: "member2026", role: "member",
    fullName: "Church Member", contact: "09XX-XXX-0000",
    address: "Pasig City", birthday: "—",
    joinedDate: "March 2024", bio: "Faithful member of D2 JTROS Mission Church.",
  },
];