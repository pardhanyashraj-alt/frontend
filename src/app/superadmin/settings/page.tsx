"use client";

import { useState } from "react";
import SuperAdminSidebar from "../../components/SuperAdminSidebar";

type TabType = "profile" | "security" | "platform";

export default function SuperAdminSettings() {
  const [activeTab, setActiveTab] = useState<TabType>("profile");
  const [isSaving, setIsSaving] = useState(false);

  const [profile, setProfile] = useState({ name: "Platform Owner", email: "owner@eduflow.com", phone: "+91 99999 00000", role: "Super Administrator" });
  const [security, setSecurity] = useState({ twoFA: true });

  const [supportedBoards, setSupportedBoards] = useState([
    { name: "CBSE", enabled: true }, { name: "ICSE", enabled: true },
    { name: "State Board", enabled: true }, { name: "IB", enabled: false },
    { name: "Cambridge", enabled: false },
  ]);

  const [supportedClasses, setSupportedClasses] = useState([
    { name: "Class 1-5", enabled: false }, { name: "Class 6-8", enabled: true },
    { name: "Class 9-10", enabled: true }, { name: "Class 11-12", enabled: true },
  ]);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => setIsSaving(false), 1000);
  };

  const toggleBoard = (idx: number) => {
    setSupportedBoards(supportedBoards.map((b, i) => i === idx ? { ...b, enabled: !b.enabled } : b));
  };

  const toggleClass = (idx: number) => {
    setSupportedClasses(supportedClasses.map((c, i) => i === idx ? { ...c, enabled: !c.enabled } : c));
  };

  const renderTab = () => {
    switch (activeTab) {
      case "profile":
        return (
          <div className="card">
            <div className="card-header" style={{ padding: '24px' }}><div className="card-title">Owner Profile</div></div>
            <div className="card-body" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '32px' }}>
                <div className="avatar" style={{ width: '80px', height: '80px', fontSize: '24px', background: '#1E40AF' }}>SA</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '18px', color: 'var(--text-primary)' }}>Profile Photo</div>
                  <div style={{ fontSize: '14px', color: 'var(--text-meta)', marginTop: '4px' }}>Update your platform owner avatar</div>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
                {[
                  { label: "Full Name", key: "name" },
                  { label: "Email Address", key: "email" },
                  { label: "Phone Number", key: "phone" },
                  { label: "Role", key: "role" },
                ].map(f => (
                  <div key={f.key} className="form-group">
                    <label className="form-label" style={{ marginBottom: '8px', display: 'block' }}>{f.label}</label>
                    <input className="form-input" style={{ width: '100%' }} value={profile[f.key as keyof typeof profile]} onChange={e => setProfile({...profile, [f.key]: e.target.value})} />
                  </div>
                ))}
              </div>
            </div>
            <div style={{ padding: '24px', display: 'flex', justifyContent: 'flex-end' }}>
              <button className="btn-primary" style={{ padding: '12px 28px', background: '#1E40AF' }} onClick={handleSave} disabled={isSaving}>{isSaving ? "Saving..." : "Save Changes"}</button>
            </div>
          </div>
        );

      case "security":
        return (
          <div className="card">
            <div className="card-header" style={{ padding: '24px' }}><div className="card-title">Security</div></div>
            <div className="card-body" style={{ padding: '24px' }}>
              <div style={{ marginBottom: '32px' }}>
                <div style={{ fontWeight: 600, marginBottom: '20px' }}>Change Password</div>
                <div className="form-group" style={{ marginBottom: '16px' }}>
                  <label className="form-label" style={{ marginBottom: '8px', display: 'block' }}>Current Password</label>
                  <input className="form-input" style={{ width: '100%', maxWidth: '400px' }} type="password" placeholder="••••••••" />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', maxWidth: '680px' }}>
                  <div className="form-group"><label className="form-label" style={{ marginBottom: '8px', display: 'block' }}>New Password</label><input className="form-input" style={{ width: '100%' }} type="password" placeholder="••••••••" /></div>
                  <div className="form-group"><label className="form-label" style={{ marginBottom: '8px', display: 'block' }}>Confirm Password</label><input className="form-input" style={{ width: '100%' }} type="password" placeholder="••••••••" /></div>
                </div>
              </div>
              <hr style={{ border: 'none', borderTop: '1px solid #E2E8F0', margin: '28px 0' }} />
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '15px' }}>Two-Factor Authentication</div>
                  <div style={{ fontSize: '13px', color: 'var(--text-meta)', marginTop: '2px' }}>Extra layer of security for platform access</div>
                </div>
                <div onClick={() => setSecurity({...security, twoFA: !security.twoFA})} style={{ width: '44px', height: '24px', background: security.twoFA ? '#1E40AF' : '#CBD5E1', borderRadius: '20px', position: 'relative', cursor: 'pointer', transition: 'all 0.3s' }}>
                  <div style={{ position: 'absolute', top: '3px', left: security.twoFA ? '23px' : '3px', width: '18px', height: '18px', background: 'white', borderRadius: '50%', transition: 'all 0.3s' }} />
                </div>
              </div>
            </div>
            <div style={{ padding: '24px', display: 'flex', justifyContent: 'flex-end' }}>
              <button className="btn-primary" style={{ padding: '12px 28px', background: '#1E40AF' }} onClick={handleSave}>Update Security</button>
            </div>
          </div>
        );

      case "platform":
        return (
          <>
            <div className="card" style={{ marginBottom: '20px' }}>
              <div className="card-header" style={{ padding: '24px' }}><div className="card-title">Supported Boards</div></div>
              <div className="card-body" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {supportedBoards.map((b, i) => (
                  <div key={b.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ fontWeight: 600, fontSize: '14px' }}>{b.name}</div>
                    <div onClick={() => toggleBoard(i)} style={{ width: '44px', height: '24px', background: b.enabled ? '#1E40AF' : '#CBD5E1', borderRadius: '20px', position: 'relative', cursor: 'pointer', transition: 'all 0.3s' }}>
                      <div style={{ position: 'absolute', top: '3px', left: b.enabled ? '23px' : '3px', width: '18px', height: '18px', background: 'white', borderRadius: '50%', transition: 'all 0.3s' }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="card" style={{ marginBottom: '20px' }}>
              <div className="card-header" style={{ padding: '24px' }}><div className="card-title">Supported Classes</div></div>
              <div className="card-body" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {supportedClasses.map((c, i) => (
                  <div key={c.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ fontWeight: 600, fontSize: '14px' }}>{c.name}</div>
                    <div onClick={() => toggleClass(i)} style={{ width: '44px', height: '24px', background: c.enabled ? '#1E40AF' : '#CBD5E1', borderRadius: '20px', position: 'relative', cursor: 'pointer', transition: 'all 0.3s' }}>
                      <div style={{ position: 'absolute', top: '3px', left: c.enabled ? '23px' : '3px', width: '18px', height: '18px', background: 'white', borderRadius: '50%', transition: 'all 0.3s' }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button className="btn-primary" style={{ padding: '12px 28px', background: '#1E40AF' }} onClick={handleSave}>{isSaving ? "Saving..." : "Save Configuration"}</button>
            </div>
          </>
        );

      default: return null;
    }
  };

  return (
    <>
      <SuperAdminSidebar activePage="settings" />
      <main className="main">
        <div className="topbar">
          <div className="topbar-left">
            <div className="greeting">Manage your platform settings</div>
            <h1>Platform Settings</h1>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', borderBottom: '1px solid #E2E8F0', paddingBottom: '2px' }}>
            {([
              { key: "profile", label: "Profile" },
              { key: "security", label: "Security" },
              { key: "platform", label: "Platform Config" },
            ] as { key: TabType; label: string }[]).map(t => (
              <button key={t.key} onClick={() => setActiveTab(t.key)} style={{
                padding: '12px 20px', border: 'none', background: 'none', fontSize: '14px', fontWeight: 600,
                color: activeTab === t.key ? '#1E40AF' : 'var(--text-meta)', cursor: 'pointer',
                borderBottom: `2px solid ${activeTab === t.key ? '#1E40AF' : 'transparent'}`, whiteSpace: 'nowrap', transition: 'all 0.23s',
              }}>{t.label}</button>
            ))}
          </div>
          <div style={{ maxWidth: '900px', width: '100%' }}>
            {renderTab()}
          </div>
        </div>
      </main>
    </>
  );
}
