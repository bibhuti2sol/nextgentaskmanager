import React from 'react';

const pricingPlans = [
  {
    name: 'Basic',
    bestFor: 'SMBs / Startups',
    monthly: '₹75,000',
    annual: '₹7,92,000',
    includedUsers: 'Up to 10',
    extraUserCost: '₹3,000 / user',
  },
  {
    name: 'Enterprise',
    bestFor: 'Mid–Large Orgs',
    monthly: '₹2,00,000',
    annual: '₹21,12,000',
    includedUsers: 'Up to 100',
    extraUserCost: '₹1,500 / user',
  },
  {
    name: 'Customized',
    bestFor: 'Large / Regulated',
    monthly: '₹3,50,000+',
    annual: 'Custom Quote',
    includedUsers: 'Custom',
    extraUserCost: 'Custom',
  },
];

const features = [
  {
    name: 'Task & Workflow Management',
    trial: true,
    basic: true,
    enterprise: true,
    customized: true,
  },
  {
    name: 'Realtime Collaboration',
    trial: true,
    basic: true,
    enterprise: true,
    customized: true,
  },
  {
    name: 'Standard Integrations (Email, Chat)',
    trial: true,
    basic: true,
    enterprise: true,
    customized: true,
  },
  {
    name: 'Automation Rules',
    trial: 'Limited',
    basic: 'Standard',
    enterprise: 'Advanced',
    customized: 'Unlimited',
  },
  {
    name: 'Reporting & Dashboards',
    trial: 'Basic',
    basic: 'Standard',
    enterprise: 'Advanced',
    customized: 'Custom',
  },
  {
    name: 'User Roles & Permissions',
    trial: 'Limited',
    basic: true,
    enterprise: true,
    customized: true,
  },
  {
    name: 'Audit Logs',
    trial: false,
    basic: false,
    enterprise: true,
    customized: true,
  },
  {
    name: 'SSO / SCIM',
    trial: false,
    basic: false,
    enterprise: true,
    customized: true,
  },
  {
    name: 'SLA',
    trial: false,
    basic: false,
    enterprise: '99.9%',
    customized: 'Custom (99.9%–99.99%)',
  },
  {
    name: 'Support',
    trial: 'Email',
    basic: 'Email',
    enterprise: '24×7 Priority',
    customized: 'Dedicated Team',
  },
  {
    name: 'Dedicated Infrastructure',
    trial: false,
    basic: false,
    enterprise: false,
    customized: true,
  },
];


export default function SignupPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-accent/5 to-background flex flex-col items-center justify-start py-12 px-4">
      <div className="w-full max-w-4xl mx-auto">
        <div className="bg-white/90 rounded-2xl shadow-2xl p-8 border border-border mb-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary/10 to-accent/10 rounded-full blur-3xl -z-10"></div>
          <div className="flex items-center gap-4 mb-8">
            <span className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-primary to-accent rounded-2xl shadow-lg">
              <svg width="32" height="32" fill="none" viewBox="0 0 32 32"><circle cx="16" cy="16" r="16" fill="#2563eb" /><text x="16" y="21" textAnchor="middle" fontSize="16" fill="#fff" fontFamily="Arial">S</text></svg>
            </span>
            <h1 className="text-3xl font-bold text-foreground">Sign Up</h1>
          </div>
          <form className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* ...form fields... */}
            <div>
              <label className="block text-sm font-medium mb-1">User Name</label>
              <input type="text" className="w-full border border-border rounded-lg px-3 py-2 bg-background focus:ring-2 focus:ring-primary/30 transition-smooth" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email ID</label>
              <input type="email" className="w-full border border-border rounded-lg px-3 py-2 bg-background focus:ring-2 focus:ring-primary/30 transition-smooth" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Organization Name</label>
              <input type="text" className="w-full border border-border rounded-lg px-3 py-2 bg-background focus:ring-2 focus:ring-primary/30 transition-smooth" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Address</label>
              <input type="text" className="w-full border border-border rounded-lg px-3 py-2 bg-background focus:ring-2 focus:ring-primary/30 transition-smooth" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">State</label>
              <input type="text" className="w-full border border-border rounded-lg px-3 py-2 bg-background focus:ring-2 focus:ring-primary/30 transition-smooth" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">City</label>
              <input type="text" className="w-full border border-border rounded-lg px-3 py-2 bg-background focus:ring-2 focus:ring-primary/30 transition-smooth" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Pin</label>
              <input type="text" className="w-full border border-border rounded-lg px-3 py-2 bg-background focus:ring-2 focus:ring-primary/30 transition-smooth" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Contact No</label>
              <input type="text" className="w-full border border-border rounded-lg px-3 py-2 bg-background focus:ring-2 focus:ring-primary/30 transition-smooth" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Team Size</label>
              <input type="number" className="w-full border border-border rounded-lg px-3 py-2 bg-background focus:ring-2 focus:ring-primary/30 transition-smooth" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Subscription Type</label>
              <select className="w-full border border-border rounded-lg px-3 py-2 bg-background focus:ring-2 focus:ring-primary/30 transition-smooth" required>
                <option value="Basic">Basic</option>
                <option value="Enterprise">Enterprise</option>
                <option value="Customized">Customized</option>
              </select>
            </div>
            <div className="md:col-span-2 flex justify-end">
              <button type="submit" className="bg-gradient-to-r from-primary to-accent text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:scale-105 transition-all duration-300">Sign Up</button>
            </div>
          </form>
        </div>

        <div className="bg-white/90 rounded-2xl shadow-xl p-8 border border-border mb-10">
          <h2 className="text-2xl font-bold mb-8 text-center text-primary">Simple, Transparent Pricing</h2>
          <p className="text-center text-muted-foreground mb-10">Choose the plan that fits your team's needs. No hidden fees, no surprises.</p>
          <div className="flex flex-col md:flex-row gap-8 justify-center items-stretch">
            {/* Starter Plan */}
            <div className="flex-1 bg-white rounded-xl shadow-lg p-8 border border-border flex flex-col items-center min-w-[260px] max-w-[340px]">
              <h3 className="text-xl font-bold mb-2">Starter</h3>
              <div className="text-3xl font-bold text-primary mb-1">₹75,000<span className="text-base font-normal text-muted-foreground">/month</span></div>
              <ul className="text-sm text-foreground mb-6 space-y-2 text-left w-full">
                <li className="flex items-center gap-2"><span className="text-success">✔</span> Up to 10 users</li>
                <li className="flex items-center gap-2"><span className="text-success">✔</span> Basic task management</li>
                <li className="flex items-center gap-2"><span className="text-success">✔</span> Email support</li>
                <li className="flex items-center gap-2"><span className="text-success">✔</span> Mobile app access</li>
              </ul>
              <button className="w-full bg-primary text-white py-2 rounded-lg font-semibold mt-auto hover:bg-primary/90 transition">Get Started</button>
            </div>
            {/* Professional Plan (Most Popular) */}
            <div className="flex-1 bg-white rounded-xl shadow-2xl p-8 border-2 border-primary flex flex-col items-center min-w-[260px] max-w-[340px] relative">
              <div className="absolute -top-5 left-1/2 -translate-x-1/2">
                <span className="bg-primary text-white text-xs font-bold px-4 py-1 rounded-full shadow">Most Popular</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Professional</h3>
              <div className="text-3xl font-bold text-primary mb-1">₹2,00,000<span className="text-base font-normal text-muted-foreground">/month</span></div>
              <ul className="text-sm text-foreground mb-6 space-y-2 text-left w-full">
                <li className="flex items-center gap-2"><span className="text-success">✔</span> Up to 100 users</li>
                <li className="flex items-center gap-2"><span className="text-success">✔</span> Advanced analytics</li>
                <li className="flex items-center gap-2"><span className="text-success">✔</span> Priority support</li>
                <li className="flex items-center gap-2"><span className="text-success">✔</span> API access</li>
                <li className="flex items-center gap-2"><span className="text-success">✔</span> Custom integrations</li>
              </ul>
              <button className="w-full bg-primary text-white py-2 rounded-lg font-semibold mt-auto hover:bg-primary/90 transition">Get Started</button>
            </div>
            {/* Enterprise Plan */}
            <div className="flex-1 bg-white rounded-xl shadow-lg p-8 border border-border flex flex-col items-center min-w-[260px] max-w-[340px]">
              <h3 className="text-xl font-bold mb-2">Enterprise</h3>
              <div className="text-3xl font-bold text-primary mb-1">Custom</div>
              <ul className="text-sm text-foreground mb-6 space-y-2 text-left w-full">
                <li className="flex items-center gap-2"><span className="text-success">✔</span> Unlimited users</li>
                <li className="flex items-center gap-2"><span className="text-success">✔</span> Custom features</li>
                <li className="flex items-center gap-2"><span className="text-success">✔</span> Dedicated support</li>
                <li className="flex items-center gap-2"><span className="text-success">✔</span> On-premise deployment</li>
                <li className="flex items-center gap-2"><span className="text-success">✔</span> SLA guarantee</li>
              </ul>
              <button className="w-full bg-primary text-white py-2 rounded-lg font-semibold mt-auto hover:bg-primary/90 transition">Contact Sales</button>
            </div>
          </div>
        </div>

        <div className="bg-white/90 rounded-2xl shadow-xl p-8 border border-border">
          <h2 className="text-2xl font-bold mb-4 text-primary">Feature Comparison</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full border rounded-lg overflow-hidden text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-4 py-2">Feature</th>
                  <th className="px-4 py-2">Trial</th>
                  <th className="px-4 py-2">Basic</th>
                  <th className="px-4 py-2">Enterprise</th>
                  <th className="px-4 py-2">Customized</th>
                </tr>
              </thead>
              <tbody>
                {features.map((feature) => (
                  <tr key={feature.name} className="border-b">
                    <td className="px-4 py-2 font-semibold">{feature.name}</td>
                    <td className="px-4 py-2 text-center">{feature.trial === true ? '✔' : feature.trial === false ? '❌' : feature.trial}</td>
                    <td className="px-4 py-2 text-center">{feature.basic === true ? '✔' : feature.basic === false ? '❌' : feature.basic}</td>
                    <td className="px-4 py-2 text-center">{feature.enterprise === true ? '✔' : feature.enterprise === false ? '❌' : feature.enterprise}</td>
                    <td className="px-4 py-2 text-center">{feature.customized === true ? '✔' : feature.customized === false ? '❌' : feature.customized}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
