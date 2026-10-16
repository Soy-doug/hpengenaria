interface Contact { name: string; phone: string; display: string; }
interface SiteContent {
  contacts: { henrik: Contact; kadja: Contact; };
  email?: string;
  instagram?: string;
  location: string;
}
const siteContent: SiteContent = {
  contacts: {
    henrik: { name: 'Henrik', phone: '5591991130303', display: '(91) 99113-0303' },
    kadja: { name: 'Kadja', phone: '5591991131368', display: '(91) 99113-1368' }
  },
  email: 'hpengenharia2019@gmail.com',
  instagram: 'https://www.instagram.com/hp__engenharia/',
  location: 'Pacajá / PA'
};
