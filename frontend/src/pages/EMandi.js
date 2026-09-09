import React, { useState, useEffect } from "react";
import axios from "axios";
import { 
  Store, 
  PlusCircle, 
  Search, 
  MapPin, 
  Calendar, 
  DollarSign, 
  MessageCircle, 
  ShieldCheck, 
  FileText, 
  X, 
  Send, 
  AlertCircle 
} from "lucide-react";
import { useLanguage } from "../LanguageContext";

function EMandi() {
  const { language } = useLanguage();
  const isKannada = language === "kn";

  const [activeTab, setActiveTab] = useState("marketplace"); // 'marketplace' | 'seller_portal'
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter states
  const [searchCrop, setSearchCrop] = useState("");
  const [filterDistrict, setFilterDistrict] = useState("All Districts");

  // New Listing Form State (Seller)
  const [form, setForm] = useState({
    sellerName: "Mahendra Gowda",
    sellerPhone: "9845012345",
    sellerEmail: "mahendra@farmx.in",
    village: "Gejjalagere",
    district: "Mandya",
    cropName: "Sugarcane",
    variety: "Co-86032 High Sugar Grade",
    quantityQuintals: 100,
    basePricePerQuintal: 3200,
    expectedHarvestDate: new Date().toISOString().split("T")[0],
    description: "Quality produce with organic manure application."
  });
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  // Bidding Modal State (Buyer)
  const [biddingModalListing, setBiddingModalListing] = useState(null);
  const [bidForm, setBidForm] = useState({
    buyerName: "",
    buyerPhone: "",
    offeredPrice: "",
    quantityQuintals: "",
    message: ""
  });
  const [bidSubmitting, setBidSubmitting] = useState(false);

  // Dispatch Slip Modal
  const [dispatchSlipListing, setDispatchSlipListing] = useState(null);

  const fetchListings = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:5000/api/emandi/listings?status=all");
      setListings(res.data);
    } catch (err) {
      console.error("Error loading e-Mandi listings:", err);
      setError("Failed to connect to e-Mandi server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);

  // Seller submits a new harvest listing
  const handleCreateListing = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSuccessMsg("");
    try {
      await axios.post("http://localhost:5000/api/emandi/listings", form);
      setSuccessMsg(isKannada ? "ನಿಮ್ಮ ಬೆಳೆ ಯಶಸ್ವಿಯಾಗಿ ನಮೂದಾಗಿದೆ!" : "Harvest listing posted successfully to e-Mandi!");
      fetchListings();
      setActiveTab("marketplace");
    } catch (err) {
      alert("Error creating listing: " + (err.response?.data?.error || err.message));
    } finally {
      setSubmitting(false);
    }
  };

  // Buyer submits a bid
  const handleSubmitBid = async (e) => {
    e.preventDefault();
    if (!biddingModalListing) return;
    setBidSubmitting(true);
    try {
      await axios.post(
        `http://localhost:5000/api/emandi/listings/${biddingModalListing.id || biddingModalListing._id}/offers`,
        bidForm
      );
      alert(isKannada ? "ನಿಮ್ಮ ಬಿಡ್ ಯಶಸ್ವಿಯಾಗಿ ಕಳುಹಿಸಲಾಗಿದೆ!" : "Offer submitted successfully to the farmer!");
      setBiddingModalListing(null);
      setBidForm({ buyerName: "", buyerPhone: "", offeredPrice: "", quantityQuintals: "", message: "" });
      fetchListings();
    } catch (err) {
      alert("Error submitting offer: " + (err.response?.data?.error || err.message));
    } finally {
      setBidSubmitting(false);
    }
  };

  // Seller accepts or rejects an offer
  const handleOfferStatus = async (listingId, offerId, status) => {
    try {
      await axios.patch(`http://localhost:5000/api/emandi/listings/${listingId}/offers/${offerId}`, { status });
      fetchListings();
    } catch (err) {
      alert("Error updating offer: " + (err.response?.data?.error || err.message));
    }
  };

  // Filter listings
  const filteredListings = listings.filter((item) => {
    const matchCrop = !searchCrop || item.cropName.toLowerCase().includes(searchCrop.toLowerCase());
    const matchDist = filterDistrict === "All Districts" || item.district.toLowerCase() === filterDistrict.toLowerCase();
    return matchCrop && matchDist;
  });

  return (
    <div style={styles.container}>
      {/* Top Banner */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>
            <Store size={32} color="#16a34a" style={{ verticalAlign: "middle", marginRight: 10 }} />
            {isKannada ? "ಇ-ಮಂಡಿ ವ್ಯಾಪಾರ ಕೇಂದ್ರ" : "farmX Live e-Mandi Marketplace"}
          </h1>
          <p style={styles.subtitle}>
            {isKannada
              ? "ಮಧ್ಯವರ್ತಿಗಳಿಲ್ಲದೆ ರೈತರು ಮತ್ತು ಸಗಟು ಖರೀದಿದಾರರ ನಡುವೆ ನೇರ ವ್ಯಾಪಾರ ವೇದಿಕೆ."
              : "Direct digital trading hub connecting Karnataka farmers directly with verified wholesale buyers."}
          </p>
        </div>

        {/* Action Tabs */}
        <div style={styles.tabContainer}>
          <button
            style={{
              ...styles.tabBtn,
              backgroundColor: activeTab === "marketplace" ? "#16a34a" : "#f1f5f9",
              color: activeTab === "marketplace" ? "#fff" : "#475569"
            }}
            onClick={() => setActiveTab("marketplace")}
          >
            <Store size={18} />
            {isKannada ? "ಮಾರುಕಟ್ಟೆ ವೀಕ್ಷಿಸಿ" : "Browse Marketplace"}
          </button>

          <button
            style={{
              ...styles.tabBtn,
              backgroundColor: activeTab === "seller_portal" ? "#16a34a" : "#f1f5f9",
              color: activeTab === "seller_portal" ? "#fff" : "#475569"
            }}
            onClick={() => setActiveTab("seller_portal")}
          >
            <PlusCircle size={18} />
            {isKannada ? "ಮಾರಾಟಗಾರರ ಪೋರ್ಟಲ್" : "Seller Portal (List Harvest)"}
          </button>
        </div>
      </div>

      {successMsg && <div style={styles.successBanner}>{successMsg}</div>}
      {error && <div style={styles.errorBanner}>{error}</div>}

      {/* TAB 1: BROWSE MARKETPLACE */}
      {activeTab === "marketplace" && (
        <div>
          {/* Search & Filter Bar */}
          <div style={styles.filterBar}>
            <div style={styles.searchBox}>
              <Search size={18} color="#94a3b8" />
              <input
                type="text"
                placeholder={isKannada ? "ಬೆಳೆಯ ಹೆಸರು ಹುಡುಕಿ..." : "Search crops (e.g. Sugarcane, Paddy)..."}
                style={styles.searchInput}
                value={searchCrop}
                onChange={(e) => setSearchCrop(e.target.value)}
              />
            </div>

            <div style={styles.filterDropdown}>
              <MapPin size={18} color="#16a34a" />
              <select
                style={styles.select}
                value={filterDistrict}
                onChange={(e) => setFilterDistrict(e.target.value)}
              >
                <option value="All Districts">{isKannada ? "ಎಲ್ಲಾ ಜಿಲ್ಲೆಗಳು" : "All Districts"}</option>
                <option value="Mandya">Mandya</option>
                <option value="Raichur">Raichur</option>
                <option value="Kolar">Kolar</option>
                <option value="Mysuru">Mysuru</option>
                <option value="Shivamogga">Shivamogga</option>
                <option value="Belagavi">Belagavi</option>
                <option value="Chitradurga">Chitradurga</option>
                <option value="Kalaburagi">Kalaburagi</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div style={styles.loadingBox}>Loading live harvest listings...</div>
          ) : filteredListings.length === 0 ? (
            <div style={styles.emptyBox}>
              <AlertCircle size={40} color="#94a3b8" />
              <p style={{ marginTop: 12, fontSize: "1.1rem" }}>
                {isKannada ? "ಯಾವುದೇ ಬೆಳೆಗಳ ಪಟ್ಟಿ ಲಭ್ಯವಿಲ್ಲ." : "No harvest listings found matching criteria."}
              </p>
            </div>
          ) : (
            <div style={styles.listingsGrid}>
              {filteredListings.map((item) => {
                const id = item.id || item._id;
                const isSold = item.status === "sold";
                const isNegotiating = item.status === "under_negotiation";
                const offersCount = item.offers?.length || 0;

                // Pre-filled WhatsApp link
                const waMessage = encodeURIComponent(
                  `Namaskara ${item.sellerName}!\nI saw your listing on farmX e-Mandi for ${item.cropName} (${item.quantityQuintals} Quintals, Base: ₹${item.basePricePerQuintal}/Qtl) in ${item.village}, ${item.district}.\nI would like to discuss procurement.`
                );
                const waUrl = `https://wa.me/91${item.sellerPhone}?text=${waMessage}`;

                return (
                  <div key={id} style={styles.card}>
                    {/* Status Pill & Slip No */}
                    <div style={styles.cardTopRow}>
                      <span
                        style={{
                          ...styles.statusPill,
                          backgroundColor: isSold ? "#fee2e2" : isNegotiating ? "#fef3c7" : "#dcfce7",
                          color: isSold ? "#991b1b" : isNegotiating ? "#92400e" : "#166534"
                        }}
                      >
                        {isSold ? "SOLD OUT" : isNegotiating ? "ACTIVE BIDS" : "AVAILABLE"}
                      </span>
                      <span style={styles.slipTag}>{item.dispatchSlipNo}</span>
                    </div>

                    {/* Crop & Variety */}
                    <h3 style={styles.cropTitle}>{item.cropName}</h3>
                    <p style={styles.varietyText}>{item.variety}</p>

                    {/* Quantity & Base Price */}
                    <div style={styles.priceRow}>
                      <div style={styles.priceBlock}>
                        <span style={styles.label}>{isKannada ? "ಲಭ್ಯವಿರುವ ಪ್ರಮಾಣ" : "Quantity Available"}</span>
                        <span style={styles.valNumber}>{item.quantityQuintals} <small>Quintals</small></span>
                      </div>
                      <div style={styles.priceBlock}>
                        <span style={styles.label}>{isKannada ? "ಮೂಲ ಬೆಲೆ" : "Base Price"}</span>
                        <span style={styles.valPrice}>₹{item.basePricePerQuintal} <small>/ Qtl</small></span>
                      </div>
                    </div>

                    {/* Farmer Location & Harvest Date */}
                    <div style={styles.metaRow}>
                      <span style={styles.metaItem}>
                        <MapPin size={15} color="#64748b" style={{ marginRight: 4 }} />
                        {item.village}, {item.district}
                      </span>
                      <span style={styles.metaItem}>
                        <Calendar size={15} color="#64748b" style={{ marginRight: 4 }} />
                        {item.expectedHarvestDate}
                      </span>
                    </div>

                    <p style={styles.descSnippet}>{item.description}</p>

                    {/* Offers Count */}
                    {offersCount > 0 && (
                      <div style={styles.bidsBadge}>
                        <ShieldCheck size={16} color="#059669" />
                        <span>{offersCount} {offersCount === 1 ? "Buyer Bid Placed" : "Buyer Bids Placed"}</span>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div style={styles.btnRow}>
                      {/* WhatsApp 1-Click Connect */}
                      <a
                        href={waUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={styles.waBtn}
                        title="Chat directly on WhatsApp"
                      >
                        <MessageCircle size={18} />
                        WhatsApp
                      </a>

                      {/* Make an Offer Button */}
                      {!isSold && (
                        <button
                          style={styles.bidBtn}
                          onClick={() => {
                            setBiddingModalListing(item);
                            setBidForm({
                              buyerName: "",
                              buyerPhone: "",
                              offeredPrice: item.basePricePerQuintal,
                              quantityQuintals: item.quantityQuintals,
                              message: ""
                            });
                          }}
                        >
                          <DollarSign size={18} />
                          {isKannada ? "ಬಿಡ್ ಸಲ್ಲಿಸಿ" : "Make Offer"}
                        </button>
                      )}

                      {/* View Dispatch Slip */}
                      <button
                        style={styles.slipBtn}
                        onClick={() => setDispatchSlipListing(item)}
                        title="View Mandi Transport Pass"
                      >
                        <FileText size={18} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: SELLER PORTAL */}
      {activeTab === "seller_portal" && (
        <div style={styles.sellerSection}>
          <div style={styles.formCard}>
            <h2 style={styles.sectionHeader}>
              <PlusCircle size={24} color="#16a34a" style={{ verticalAlign: "middle", marginRight: 8 }} />
              {isKannada ? "ಹೊಸ ಬೆಳೆಯ ಪಟ್ಟಿ ನಮೂದಿಸಿ (ಮಾರಾಟಗಾರರ ಅರ್ಜಿ)" : "List My Harvest (Seller Registration)"}
            </h2>
            <p style={{ color: "#64748b", marginBottom: 20 }}>
              {isKannada
                ? "ನಿಮ್ಮ ಕೃಷಿ ಉತ್ಪನ್ನವನ್ನು ನೇರವಾಗಿ ಇ-ಮಂಡಿಯಲ್ಲಿ ನೋಂದಾಯಿಸಿ ಅತ್ಯುತ್ತಮ ಬೆಲೆ ಪಡೆಯಿರಿ."
                : "Post your upcoming harvest directly to verified grain buyers, millers, and exporters."}
            </p>

            <form onSubmit={handleCreateListing} style={styles.gridForm}>
              <div style={styles.inputGroup}>
                <label style={styles.inputLabel}>{isKannada ? "ರೈತರ ಹೆಸರು" : "Farmer / Seller Name"} *</label>
                <input
                  type="text"
                  required
                  style={styles.input}
                  value={form.sellerName}
                  onChange={(e) => setForm({ ...form, sellerName: e.target.value })}
                />
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.inputLabel}>{isKannada ? "ಮೊಬೈಲ್ ಸಂಖ್ಯೆ (ವಾಟ್ಸಾಪ್)" : "Mobile Phone (WhatsApp)"} *</label>
                <input
                  type="tel"
                  required
                  style={styles.input}
                  value={form.sellerPhone}
                  onChange={(e) => setForm({ ...form, sellerPhone: e.target.value })}
                />
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.inputLabel}>{isKannada ? "ಬೆಳೆಯ ಹೆಸರು" : "Crop Name"} *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sugarcane, Ragi, Paddy"
                  style={styles.input}
                  value={form.cropName}
                  onChange={(e) => setForm({ ...form, cropName: e.target.value })}
                />
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.inputLabel}>{isKannada ? "ತಳಿ / ಗುಣಮಟ್ಟ" : "Variety / Quality Grade"}</label>
                <input
                  type="text"
                  placeholder="e.g. Co-86032, Sona Masuri, Grade A"
                  style={styles.input}
                  value={form.variety}
                  onChange={(e) => setForm({ ...form, variety: e.target.value })}
                />
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.inputLabel}>{isKannada ? "ಪ್ರಮಾಣ (ಕ್ವಿಂಟಾಲ್)" : "Quantity (Quintals)"} *</label>
                <input
                  type="number"
                  min="1"
                  required
                  style={styles.input}
                  value={form.quantityQuintals}
                  onChange={(e) => setForm({ ...form, quantityQuintals: e.target.value })}
                />
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.inputLabel}>{isKannada ? "ಮೂಲ ಬೆಲೆ (₹/ಕ್ವಿಂಟಾಲ್)" : "Expected Base Price (₹ / Qtl)"} *</label>
                <input
                  type="number"
                  min="1"
                  required
                  style={styles.input}
                  value={form.basePricePerQuintal}
                  onChange={(e) => setForm({ ...form, basePricePerQuintal: e.target.value })}
                />
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.inputLabel}>{isKannada ? "ಗ್ರಾಮ / ತಾಲೂಕು" : "Village / Taluk"} *</label>
                <input
                  type="text"
                  required
                  style={styles.input}
                  value={form.village}
                  onChange={(e) => setForm({ ...form, village: e.target.value })}
                />
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.inputLabel}>{isKannada ? "ಜಿಲ್ಲೆ" : "District"} *</label>
                <select
                  style={styles.input}
                  value={form.district}
                  onChange={(e) => setForm({ ...form, district: e.target.value })}
                >
                  <option value="Mandya">Mandya</option>
                  <option value="Raichur">Raichur</option>
                  <option value="Kolar">Kolar</option>
                  <option value="Mysuru">Mysuru</option>
                  <option value="Shivamogga">Shivamogga</option>
                  <option value="Belagavi">Belagavi</option>
                  <option value="Kalaburagi">Kalaburagi</option>
                  <option value="Dharwad">Dharwad</option>
                  <option value="Tumakuru">Tumakuru</option>
                </select>
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.inputLabel}>{isKannada ? "ನಿರೀಕ್ಷಿತ ಕೊಯ್ಲು ದಿನಾಂಕ" : "Expected Harvest Date"} *</label>
                <input
                  type="date"
                  required
                  style={styles.input}
                  value={form.expectedHarvestDate}
                  onChange={(e) => setForm({ ...form, expectedHarvestDate: e.target.value })}
                />
              </div>

              <div style={{ ...styles.inputGroup, gridColumn: "span 2" }}>
                <label style={styles.inputLabel}>{isKannada ? "ವಿವರಣೆ / ಉತ್ಪನ್ನದ ಗುಣಲಕ್ಷಣ" : "Description & Special Notes"}</label>
                <textarea
                  rows="2"
                  style={styles.input}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
              </div>

              <div style={{ gridColumn: "span 2", marginTop: 10 }}>
                <button type="submit" style={styles.submitBtn} disabled={submitting}>
                  {submitting 
                    ? (isKannada ? "ನಮೂದಿಸಲಾಗುತ್ತಿದೆ..." : "Publishing to Mandi...") 
                    : (isKannada ? "ಬೆಳೆ ಮಾರಾಟಕ್ಕೆ ಪ್ರಕಟಿಸಿ" : "Publish Harvest to e-Mandi")}
                </button>
              </div>
            </form>
          </div>

          {/* SELLER'S OFFERS MANAGEMENT TABLE */}
          <div style={styles.manageCard}>
            <h3 style={styles.manageTitle}>
              <ShieldCheck size={22} color="#16a34a" style={{ verticalAlign: "middle", marginRight: 8 }} />
              {isKannada ? "ಸ್ವೀಕರಿಸಿದ ಬಿಡ್‌ಗಳು ಮತ್ತು ಆಫರ್‌ಗಳು" : "Incoming Bids & Buyer Offers Received"}
            </h3>

            <div style={styles.tableResponsive}>
              <table style={styles.table}>
                <thead>
                  <tr style={styles.thRow}>
                    <th style={styles.th}>Harvest Listing</th>
                    <th style={styles.th}>Buyer Name</th>
                    <th style={styles.th}>Buyer Phone</th>
                    <th style={styles.th}>Offered Price</th>
                    <th style={styles.th}>Requested Qty</th>
                    <th style={styles.th}>Status</th>
                    <th style={styles.th}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {listings.flatMap((l) =>
                    (l.offers || []).map((off) => {
                      const listId = l.id || l._id;
                      const offId = off._id;
                      return (
                        <tr key={offId} style={styles.tr}>
                          <td style={styles.td}>
                            <strong>{l.cropName}</strong> ({l.quantityQuintals} Qtl)
                          </td>
                          <td style={styles.td}>{off.buyerName}</td>
                          <td style={styles.td}>
                            <a href={`tel:${off.buyerPhone}`} style={{ color: "#2563eb", textDecoration: "none" }}>
                              {off.buyerPhone}
                            </a>
                          </td>
                          <td style={styles.td}><strong style={{ color: "#16a34a" }}>₹{off.offeredPrice}</strong> /Qtl</td>
                          <td style={styles.td}>{off.quantityQuintals} Qtl</td>
                          <td style={styles.td}>
                            <span
                              style={{
                                padding: "4px 10px",
                                borderRadius: 12,
                                fontSize: "0.8rem",
                                fontWeight: 700,
                                backgroundColor:
                                  off.status === "accepted" ? "#dcfce7" : off.status === "rejected" ? "#fee2e2" : "#fef3c7",
                                color:
                                  off.status === "accepted" ? "#166534" : off.status === "rejected" ? "#991b1b" : "#92400e"
                              }}
                            >
                              {off.status.toUpperCase()}
                            </span>
                          </td>
                          <td style={styles.td}>
                            {off.status === "pending" ? (
                              <div style={{ display: "flex", gap: 6 }}>
                                <button
                                  style={styles.acceptBtn}
                                  onClick={() => handleOfferStatus(listId, offId, "accepted")}
                                >
                                  Accept
                                </button>
                                <button
                                  style={styles.rejectBtn}
                                  onClick={() => handleOfferStatus(listId, offId, "rejected")}
                                >
                                  Reject
                                </button>
                              </div>
                            ) : (
                              <span style={{ fontSize: "0.85rem", color: "#64748b" }}>Finalized</span>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* BIDDING POPUP MODAL (BUYER) */}
      {biddingModalListing && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <div style={styles.modalHeader}>
              <h3 style={{ margin: 0, fontSize: "1.3rem" }}>
                Make an Offer: {biddingModalListing.cropName}
              </h3>
              <button style={styles.closeBtn} onClick={() => setBiddingModalListing(null)}>
                <X size={20} />
              </button>
            </div>

            <p style={{ color: "#64748b", fontSize: "0.9rem", margin: "6px 0 16px 0" }}>
              Seller: <strong>{biddingModalListing.sellerName}</strong> ({biddingModalListing.village}, {biddingModalListing.district}) | Base: ₹{biddingModalListing.basePricePerQuintal}/Qtl
            </p>

            <form onSubmit={handleSubmitBid} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <label style={styles.inputLabel}>Your Name / Company *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Agro Mills"
                  style={styles.input}
                  value={bidForm.buyerName}
                  onChange={(e) => setBidForm({ ...bidForm, buyerName: e.target.value })}
                />
              </div>

              <div>
                <label style={styles.inputLabel}>Contact Phone (WhatsApp) *</label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. 9845123456"
                  style={styles.input}
                  value={bidForm.buyerPhone}
                  onChange={(e) => setBidForm({ ...bidForm, buyerPhone: e.target.value })}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={styles.inputLabel}>Offered Price (₹ / Qtl) *</label>
                  <input
                    type="number"
                    required
                    style={styles.input}
                    value={bidForm.offeredPrice}
                    onChange={(e) => setBidForm({ ...bidForm, offeredPrice: e.target.value })}
                  />
                </div>

                <div>
                  <label style={styles.inputLabel}>Procurement Qty (Quintals) *</label>
                  <input
                    type="number"
                    required
                    style={styles.input}
                    value={bidForm.quantityQuintals}
                    onChange={(e) => setBidForm({ ...bidForm, quantityQuintals: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label style={styles.inputLabel}>Message to Farmer</label>
                <input
                  type="text"
                  placeholder="e.g. Can load directly from farmyard this weekend."
                  style={styles.input}
                  value={bidForm.message}
                  onChange={(e) => setBidForm({ ...bidForm, message: e.target.value })}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 10 }}>
                <button
                  type="button"
                  style={styles.cancelBtn}
                  onClick={() => setBiddingModalListing(null)}
                >
                  Cancel
                </button>
                <button type="submit" style={styles.submitBtn} disabled={bidSubmitting}>
                  <Send size={16} style={{ marginRight: 6 }} />
                  {bidSubmitting ? "Submitting..." : "Send Offer to Farmer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DISPATCH SLIP MODAL */}
      {dispatchSlipListing && (
        <div style={styles.modalOverlay}>
          <div style={{ ...styles.modalContent, maxWidth: 500, backgroundColor: "#f8fafc" }}>
            <div style={styles.modalHeader}>
              <h3 style={{ margin: 0, color: "#166534" }}>
                <ShieldCheck size={22} style={{ verticalAlign: "middle", marginRight: 6 }} />
                APMC Mandi Dispatch Pass
              </h3>
              <button style={styles.closeBtn} onClick={() => setDispatchSlipListing(null)}>
                <X size={20} />
              </button>
            </div>

            <div style={{ backgroundColor: "#fff", padding: 20, borderRadius: 10, border: "1px solid #cbd5e1", marginTop: 14 }}>
              <div style={{ textAlign: "center", borderBottom: "1px dashed #cbd5e1", paddingBottom: 10, marginBottom: 12 }}>
                <h4 style={{ margin: "0 0 4px 0", color: "#1e293b" }}>farmX Agriculture Logistics</h4>
                <span style={{ fontSize: "0.85rem", color: "#64748b" }}>Pass No: <strong>{dispatchSlipListing.dispatchSlipNo}</strong></span>
              </div>

              <p style={{ margin: "6px 0", fontSize: "0.9rem" }}><strong>Farmer:</strong> {dispatchSlipListing.sellerName} ({dispatchSlipListing.sellerPhone})</p>
              <p style={{ margin: "6px 0", fontSize: "0.9rem" }}><strong>Location:</strong> {dispatchSlipListing.village}, {dispatchSlipListing.district}</p>
              <p style={{ margin: "6px 0", fontSize: "0.9rem" }}><strong>Produce:</strong> {dispatchSlipListing.cropName} ({dispatchSlipListing.variety})</p>
              <p style={{ margin: "6px 0", fontSize: "0.9rem" }}><strong>Quantity:</strong> {dispatchSlipListing.quantityQuintals} Quintals</p>
              <p style={{ margin: "6px 0", fontSize: "0.9rem" }}><strong>Agreed Base Price:</strong> ₹{dispatchSlipListing.basePricePerQuintal} / Qtl</p>
              <p style={{ margin: "6px 0", fontSize: "0.9rem" }}><strong>Target Harvest Date:</strong> {dispatchSlipListing.expectedHarvestDate}</p>
            </div>

            <button
              style={{ ...styles.submitBtn, width: "100%", marginTop: 16 }}
              onClick={() => window.print()}
            >
              Print Transport Gate Pass
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    padding: "32px 40px",
    maxWidth: 1240,
    margin: "0 auto",
    fontFamily: "'Segoe UI', Roboto, sans-serif"
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    flexWrap: "wrap",
    gap: 16,
    marginBottom: 26
  },
  title: {
    fontSize: "2rem",
    fontWeight: 800,
    color: "#1e293b",
    margin: 0
  },
  subtitle: {
    fontSize: "1rem",
    color: "#64748b",
    marginTop: 6,
    marginBottom: 0
  },
  tabContainer: {
    display: "flex",
    gap: 10,
    backgroundColor: "#f1f5f9",
    padding: 6,
    borderRadius: 12
  },
  tabBtn: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "10px 18px",
    borderRadius: 8,
    border: "none",
    fontWeight: 700,
    fontSize: "0.9rem",
    cursor: "pointer",
    transition: "all 0.2s"
  },
  successBanner: {
    padding: "14px 18px",
    backgroundColor: "#dcfce7",
    color: "#166534",
    borderRadius: 10,
    fontWeight: 600,
    marginBottom: 20
  },
  errorBanner: {
    padding: "14px 18px",
    backgroundColor: "#fee2e2",
    color: "#991b1b",
    borderRadius: 10,
    fontWeight: 600,
    marginBottom: 20
  },
  filterBar: {
    display: "flex",
    gap: 14,
    marginBottom: 24,
    flexWrap: "wrap"
  },
  searchBox: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#fff",
    border: "1.5px solid #cbd5e1",
    borderRadius: 10,
    padding: "0 14px",
    flex: 1,
    minWidth: 260
  },
  searchInput: {
    border: "none",
    outline: "none",
    padding: "12px 0",
    fontSize: "0.95rem",
    width: "100%"
  },
  filterDropdown: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#fff",
    border: "1.5px solid #cbd5e1",
    borderRadius: 10,
    padding: "0 12px"
  },
  select: {
    border: "none",
    outline: "none",
    fontSize: "0.95rem",
    padding: "12px 0",
    fontWeight: 600,
    cursor: "pointer",
    background: "transparent"
  },
  loadingBox: {
    textAlign: "center",
    padding: "60px",
    color: "#64748b",
    fontSize: "1.1rem"
  },
  emptyBox: {
    textAlign: "center",
    padding: "60px 20px",
    color: "#64748b"
  },
  listingsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
    gap: 22
  },
  card: {
    backgroundColor: "#fff",
    border: "1.5px solid #e2e8f0",
    borderRadius: 16,
    padding: "22px",
    boxShadow: "0 4px 14px rgba(0,0,0,0.04)",
    display: "flex",
    flexDirection: "column"
  },
  cardTopRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12
  },
  statusPill: {
    padding: "4px 10px",
    borderRadius: 20,
    fontSize: "0.75rem",
    fontWeight: 800,
    letterSpacing: 0.4
  },
  slipTag: {
    fontSize: "0.75rem",
    color: "#94a3b8",
    fontFamily: "monospace"
  },
  cropTitle: {
    fontSize: "1.4rem",
    fontWeight: 800,
    color: "#1e293b",
    margin: "0 0 4px 0"
  },
  varietyText: {
    fontSize: "0.85rem",
    color: "#64748b",
    margin: "0 0 16px 0",
    fontWeight: 600
  },
  priceRow: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 12,
    backgroundColor: "#f8fafc",
    padding: "12px 14px",
    borderRadius: 10,
    marginBottom: 16
  },
  priceBlock: {
    display: "flex",
    flexDirection: "column"
  },
  label: {
    fontSize: "0.75rem",
    color: "#64748b",
    fontWeight: 600,
    marginBottom: 2
  },
  valNumber: {
    fontSize: "1.2rem",
    fontWeight: 800,
    color: "#1e293b"
  },
  valPrice: {
    fontSize: "1.2rem",
    fontWeight: 800,
    color: "#16a34a"
  },
  metaRow: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "0.85rem",
    color: "#475569",
    marginBottom: 12
  },
  metaItem: {
    display: "flex",
    alignItems: "center",
    fontWeight: 500
  },
  descSnippet: {
    fontSize: "0.85rem",
    color: "#475569",
    lineHeight: 1.4,
    marginBottom: 16,
    flex: 1
  },
  bidsBadge: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#ecfdf5",
    color: "#065f46",
    padding: "6px 10px",
    borderRadius: 8,
    fontSize: "0.8rem",
    fontWeight: 700,
    marginBottom: 14
  },
  btnRow: {
    display: "flex",
    gap: 8,
    marginTop: "auto"
  },
  waBtn: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    flex: 1,
    padding: "10px 12px",
    backgroundColor: "#25D366",
    color: "#fff",
    borderRadius: 10,
    fontWeight: 700,
    fontSize: "0.85rem",
    textDecoration: "none",
    boxShadow: "0 2px 6px rgba(37, 211, 102, 0.2)"
  },
  bidBtn: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    flex: 1,
    padding: "10px 12px",
    backgroundColor: "#16a34a",
    color: "#fff",
    borderRadius: 10,
    fontWeight: 700,
    fontSize: "0.85rem",
    border: "none",
    cursor: "pointer",
    boxShadow: "0 2px 6px rgba(22, 163, 74, 0.2)"
  },
  slipBtn: {
    padding: "10px 12px",
    backgroundColor: "#f1f5f9",
    border: "1px solid #cbd5e1",
    borderRadius: 10,
    color: "#475569",
    cursor: "pointer"
  },
  sellerSection: {
    display: "flex",
    flexDirection: "column",
    gap: 28
  },
  formCard: {
    backgroundColor: "#fff",
    padding: "28px",
    borderRadius: 16,
    border: "1px solid #e2e8f0",
    boxShadow: "0 4px 16px rgba(0,0,0,0.04)"
  },
  sectionHeader: {
    fontSize: "1.4rem",
    fontWeight: 800,
    color: "#1e293b",
    margin: "0 0 6px 0"
  },
  gridForm: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 16
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: 6
  },
  inputLabel: {
    fontSize: "0.85rem",
    fontWeight: 700,
    color: "#334155"
  },
  input: {
    padding: "10px 14px",
    borderRadius: 8,
    border: "1.5px solid #cbd5e1",
    fontSize: "0.95rem",
    outline: "none"
  },
  submitBtn: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#16a34a",
    color: "#fff",
    padding: "12px 24px",
    borderRadius: 10,
    fontWeight: 700,
    fontSize: "1rem",
    border: "none",
    cursor: "pointer",
    boxShadow: "0 2px 8px rgba(22, 163, 74, 0.3)"
  },
  manageCard: {
    backgroundColor: "#fff",
    padding: "24px",
    borderRadius: 16,
    border: "1px solid #e2e8f0"
  },
  manageTitle: {
    fontSize: "1.2rem",
    fontWeight: 800,
    color: "#1e293b",
    margin: "0 0 16px 0"
  },
  tableResponsive: {
    overflowX: "auto"
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: "0.9rem"
  },
  thRow: {
    backgroundColor: "#f8fafc",
    textAlign: "left"
  },
  th: {
    padding: "12px 14px",
    color: "#475569",
    fontWeight: 700,
    borderBottom: "2px solid #e2e8f0"
  },
  tr: {
    borderBottom: "1px solid #f1f5f9"
  },
  td: {
    padding: "12px 14px",
    color: "#1e293b"
  },
  acceptBtn: {
    padding: "6px 12px",
    backgroundColor: "#16a34a",
    color: "#fff",
    borderRadius: 6,
    border: "none",
    fontWeight: 700,
    fontSize: "0.8rem",
    cursor: "pointer"
  },
  rejectBtn: {
    padding: "6px 12px",
    backgroundColor: "#ef4444",
    color: "#fff",
    borderRadius: 6,
    border: "none",
    fontWeight: 700,
    fontSize: "0.8rem",
    cursor: "pointer"
  },
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
    padding: 16
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: "24px 28px",
    width: "100%",
    maxWidth: 480,
    boxShadow: "0 20px 40px rgba(0,0,0,0.2)"
  },
  modalHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottom: "1px solid #e2e8f0",
    paddingBottom: 12
  },
  closeBtn: {
    background: "none",
    border: "none",
    cursor: "pointer",
    color: "#64748b"
  },
  cancelBtn: {
    padding: "10px 18px",
    backgroundColor: "#f1f5f9",
    color: "#475569",
    borderRadius: 8,
    border: "none",
    fontWeight: 700,
    cursor: "pointer"
  }
};

export default EMandi;
