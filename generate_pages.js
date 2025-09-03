const fs = require('fs');
const path = require('path');

function slugify(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function pageTemplate(title, blurb, linksHtml, depth, backHref) {
  const homeLink = depth > 0 ? `<p><a href="${'../'.repeat(depth)}index.html">Home</a></p>` : '';
  const backLink = backHref ? `<p><a href="${backHref}">Back</a></p>` : '';
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<title>${title}</title>
</head>
<body>
${homeLink}
${backLink}
<h1>${title}</h1>
<p>${blurb}</p>
${linksHtml}
</body>
</html>
`;
}

function node(t, blurb, children=[]) { return {title:t, blurb, children}; }

const data = node("Web3", "A user-empowering internet that encodes trust and value natively using cryptography, blockchains, and open protocols.", [
  node("Foundations & Principles", "The philosophies and properties that make Web3 distinct from Web2.", [
    node("Decentralization", "Shift of control from single authorities to distributed participants."),
    node("Trust & Security", "Trust arises from math and incentives rather than intermediaries."),
    node("Identity & Privacy", "Self-sovereign identity (SSI) and selective disclosure with modern cryptography."),
    node("Governance & DAOs", "On-chain rules and token-holder voting coordinate groups transparently."),
    node("Interoperability", "Composability and cross-chain bridges enable ecosystems to connect."),
  ]),
  node("Blockchain Infrastructure", "Systems that run the ledger, scale throughput, and store data.", [
    node("Layer-1 Blockchains", "Base networks like Ethereum, Solana, Cosmos zones, etc."),
    node("Layer-2 Scalability", "Rollups and channels that increase capacity while inheriting L1 security."),
    node("Consensus Mechanisms", "Protocols (PoS, PoW, etc.) to agree securely on the ledger state."),
    node("Storage & Data", "Decentralized storage such as IPFS/Filecoin; indexers and data availability."),
    node("Networking & Nodes", "Peer-to-peer networking, clients, validators, and node operations."),
  ]),
  node("Smart Contracts & Protocols", "Programmable agreements and the standards that make them interoperable.", [
    node("Languages & VMs", "Solidity, Vyper, Move; EVM and WASM execution."),
    node("Oracles & Off-chain", "Bring external data/computation on-chain securely."),
    node("Standards & Interfaces", "Token and protocol interfaces (e.g., ERCs) that enable composability."),
    node("Verification & Testing", "Audits, fuzzing, formal proofs to reduce vulnerabilities."),
    node("Upgradeability & Patterns", "Proxy patterns, governance-gated changes, safe migration."),
  ]),
  node("Digital Assets & Tokenomics", "Design of tokens, incentives, and value capture.", [
    node("Fungible Tokens", "Interchangeable assets used for utility, governance, or payments."),
    node("Non-Fungible Tokens (NFTs)", "Unique assets representing art, tickets, identity, or RWAs."),
    node("Stablecoins", "Price-stable tokens (fiat-backed, crypto-collateralized, or algorithmic)."),
    node("Treasury & DAOs", "On-chain treasuries, voting power, and capital allocation."),
    node("Incentives & Game Theory", "Token emissions, staking, and mechanism design to align behavior."),
  ]),
  node("Applications & Ecosystems", "User-facing use cases and the surrounding landscape.", [
    node("DeFi", "Open financial primitives: exchange, lending, derivatives, asset management."),
    node("Web3 Social", "User-owned graphs, portable handles, creator monetization."),
    node("Gaming & Metaverse", "Playable economies, digital ownership, interoperable assets."),
    node("Supply Chain & RWAs", "Track provenance and tokenize real-world assets."),
    node("Regulation & Compliance", "KYC/AML approaches, travel-rule tools, and policy trends."),
  ])
]);

const curatedL4 = {
  "Decentralization": [
    ["Node Diversity","Many independent operators reduce capture risk."],
    ["Censorship Resistance","Hard to block transactions or exclude users."],
    ["Fault Tolerance","No single point whose failure halts the network."],
    ["Edge vs Cloud","Favor local control over centralized hosting."],
    ["Trade-offs","Latency, UX, and costs can rise with distribution."]
  ],
  "Trust & Security": [
    ["Cryptography Basics","Hashes, signatures, and Merkle proofs secure state."],
    ["Key Management","Seed phrases, hardware wallets, MPC custody."],
    ["Audits","Independent reviews to catch vulnerabilities early."],
    ["Bug Bounties","Reward white-hats for responsible disclosure."],
    ["Attack Vectors","Reentrancy, price oracles, MEV, governance attacks."]
  ],
  "Identity & Privacy": [
    ["DIDs & VCs","Decentralized identifiers and verifiable credentials."],
    ["Selective Disclosure","Prove attributes without leaking everything."],
    ["Zero-Knowledge","ZKPs enable private yet verifiable statements."],
    ["Reputation Graphs","On-chain history and attestations signal trust."],
    ["UX of Keys","Recovery, social guardians, and account abstraction."]
  ],
  "Governance & DAOs": [
    ["Voting Systems","1-token-1-vote, quadratic, conviction voting, etc."],
    ["Delegation","Elect stewards to scale decisions and expertise."],
    ["Constitution","Rules of change and conflict resolution on-chain."],
    ["Treasury Controls","Safeguards, multisigs, timelocks, and audits."],
    ["Participation","Incentives and rituals that keep members engaged."]
  ],
  "Interoperability": [
    ["Bridges","Move assets/messages across chains securely."],
    ["Standards","Common token and contract interfaces reduce friction."],
    ["Shared Security","Consumer chains borrow security from a hub."],
    ["Cross-chain Apps","Single UX spanning multiple networks."],
    ["Risks","Bridge exploits and fragmented liquidity."]
  ],

  "Layer-1 Blockchains": [
    ["Execution","How transactions run (EVM, WASM, parallelism)."],
    ["Data Availability","Guarantee that block data is retrievable."],
    ["Finality","Economic or probabilistic guarantees of permanence."],
    ["Client Diversity","Multiple implementations reduce correlated bugs."],
    ["Token Utility","Fee, staking, governance use for native token."]
  ],
  "Layer-2 Scalability": [
    ["Optimistic Rollups","Assume validity; fraud proofs challenge bad blocks."],
    ["ZK Rollups","Validity proofs ensure correctness without re-execution."],
    ["State Channels","Peer sets transact off-chain, settle periodically."],
    ["Shared Sequencing","Fair ordering and reduced MEV on L2s."],
    ["Bridging UX","Fast exits, liquidity providers, security caveats."]
  ],
  "Consensus Mechanisms": [
    ["PoS Staking","Validators bond tokens and get slashed for faults."],
    ["Leader Election","VRF/round-robin select block proposers fairly."],
    ["Finality Gadgets","Checkpoint mechanisms to lock history."],
    ["Sybil Resistance","Costs (stake/work/identity) deter spam."],
    ["Incentive Design","Rewards and penalties align honest behavior."]
  ],
  "Storage & Data": [
    ["IPFS Basics","Content addressing with hashes, not locations."],
    ["Filecoin/Economics","Markets that pay for durable storage."],
    ["Indexing/Subgraphs","Queryable views for dApps."],
    ["Data Availability Layers","Specialized chains for blob/data posting."],
    ["Privacy Layers","Encrypted storage and access control."]
  ],
  "Networking & Nodes": [
    ["P2P Gossip","Propagate blocks/tx quickly and reliably."],
    ["Light Clients","Verify with minimal resources (SPV/ZK-LC)."],
    ["Validator Ops","Uptime, monitoring, backups, key safety."],
    ["RPC & Infra","Gateways, rate limits, and decentralization."],
    ["Observability","Mempool, logs, metrics, and alerts."]
  ],

  "Languages & VMs": [
    ["Type Safety","Catch bugs earlier; avoid foot-guns."],
    ["Gas Model","Meter computation/storage to prevent abuse."],
    ["WASM Runtimes","Multi-language smart contracts via WASM."],
    ["Parallel Execution","Increase throughput with safe concurrency."],
    ["Toolchains","Compilers, linters, formatters, IDE support."]
  ],
  "Oracles & Off-chain": [
    ["Price Feeds","Reliable asset prices for DeFi protocols."],
    ["Compute Networks","Off-chain tasks with verifiable outputs."],
    ["Randomness","Unbiasable randomness for lotteries/games."],
    ["Bridge Security","Economic security and multi-sig risks."],
    ["Data Integrity","Signing, attestation, replay protection."]
  ],
  "Standards & Interfaces": [
    ["ERC-20","Fungible token interface for transfers/allowance."],
    ["ERC-721/1155","Non-fungible and semi-fungible standards."],
    ["Permit/EIP-2612","Gasless approvals via signatures."],
    ["Meta-Tx","Relayers pay gas; better UX."],
    ["Composability","Plug-and-play across protocols."]
  ],
  "Verification & Testing": [
    ["Unit/Property Tests","Check behavior and invariants."],
    ["Fuzzing","Generate random inputs to find edge cases."],
    ["Symbolic Exec","Explore paths mathematically for bugs."],
    ["Formal Proofs","Machine-checked correctness proofs."],
    ["Runtime Guards","Circuit breakers, pause switches, rate limits."]
  ],
  "Upgradeability & Patterns": [
    ["Proxy Pattern","Separate logic and storage for upgrades."],
    ["Governance Gates","Timelocks and voting for changes."],
    ["Migration Plans","Safely move funds/state to new versions."],
    ["Modularity","Composable components reduce risk."],
    ["Backward Compat","Avoid breaking dependents."]
  ],

  "Fungible Tokens": [
    ["Utility","Pay fees, access services, or reward usage."],
    ["Governance","Vote on parameters, elect delegates."],
    ["Liquidity","Pools enable trading and price discovery."],
    ["Distribution","Airdrops, sales, and vesting schedules."],
    ["Compliance","Transfer restrictions, blacklists, disclosures."]
  ],
  "Non-Fungible Tokens (NFTs)": [
    ["Metadata","On/off-chain storage and mutability choices."],
    ["Royalties","Creator revenue models and enforcement."],
    ["Tickets/Access","Memberships and event passes."],
    ["Identity","Soulbound/attestation-style credentials."],
    ["RWAs","Tokenize property, collectibles, certificates."]
  ],
  "Stablecoins": [
    ["Fiat-Backed","Off-chain reserves and attestations."],
    ["Crypto-Collateral","Over-collateralized, on-chain transparency."],
    ["Algorithmic","Supply rules target a peg (high risk)."],
    ["Payment Rails","Low-cost global settlement."],
    ["Policy Risks","Regulatory oversight and bank integration."]
  ],
  "Treasury & DAOs": [
    ["Budgeting","Fund roadmaps, grants, and ops."],
    ["Diversification","Manage exposure and risk."],
    ["Transparency","On-chain accounting and dashboards."],
    ["Security","Multisigs, MPC, insurance coverage."],
    ["Compensation","Contributor rewards and vesting."]
  ],
  "Incentives & Game Theory": [
    ["Staking","Lock tokens for yield and security."],
    ["Liquidity Mining","Reward LPs for providing depth."],
    ["Fee Sharing","Split protocol revenues with users."],
    ["Anti-Sybil","Deter fake accounts and farming."],
    ["Sustainability","Avoid ponzinomics; align long-term."]
  ],

  "DeFi": [
    ["DEXs","AMMs and order books for swaps."],
    ["Lending","Over-collateralized loans and credit primitives."],
    ["Derivatives","Perps, options, and structured products."],
    ["Asset Management","Vaults and auto-rebalancing strategies."],
    ["Risk Management","Oracles, LTVs, liquidations, insurance."]
  ],
  "Web3 Social": [
    ["Portable Handles","Usernames/IDs you can take anywhere."],
    ["Social Graphs","Open, user-owned follower relations."],
    ["Creator Monetization","Tokens, tipping, and revenue shares."],
    ["Moderation","Community rules, client-side filters."],
    ["Interoperable Feeds","Multiple apps over the same graph."]
  ],
  "Gaming & Metaverse": [
    ["Asset Ownership","Players truly own items/skins."],
    ["Economy Design","Sinks/sources and inflation control."],
    ["Interoperability","Use assets across games/worlds."],
    ["On/Off-chain Mix","Latency-friendly hybrids for UX."],
    ["Anti-Cheat","Proofs and attestations for fairness."]
  ],
  "Supply Chain & RWAs": [
    ["Provenance","Track origin and custody changes."],
    ["Tokenization","On-chain representation of assets."],
    ["Compliance Rails","Whitelists and attested participants."],
    ["Oracles","Verified real-world events and data."],
    ["Settlement","Atomic delivery-versus-payment."]
  ],
  "Regulation & Compliance": [
    ["KYC/AML","Know-your-customer and anti-laundering checks."],
    ["Travel Rule","Share originator/beneficiary data between VASPs."],
    ["Licensing","Exchange/custody requirements by jurisdiction."],
    ["Taxation","Gains, reporting, and cost basis."],
    ["Policy Trends","Global coordination and sandboxes."]
  ]
};

function generate(node, dir, depth, backHref) {
  fs.mkdirSync(dir, { recursive: true });
  let links = '';
  if (node.children && node.children.length) {
    links += '<ul>\n';
    node.children.forEach(child => {
      const slug = slugify(child.title);
      links += `  <li><a href="${slug}/index.html">${child.title}</a></li>\n`;
    });
    links += '</ul>\n';
  }
  const l4 = curatedL4[node.title] || [];
  if (l4.length) {
    links += '<ul>\n';
    l4.forEach(([title, blurb]) => {
      const slug = slugify(title);
      links += `  <li><a href="${slug}.html">${title}</a></li>\n`;
      const l4Html = pageTemplate(title, blurb, '', depth, 'index.html');
      fs.writeFileSync(path.join(dir, `${slug}.html`), l4Html);
    });
    links += '</ul>\n';
  }
  const html = pageTemplate(node.title, node.blurb, links, depth, backHref);
  fs.writeFileSync(path.join(dir, 'index.html'), html);
  if (node.children && node.children.length) {
    node.children.forEach(child => {
      const slug = slugify(child.title);
      generate(child, path.join(dir, slug), depth + 1, '../index.html');
    });
  }
}

generate(data, '.', 0, null);
