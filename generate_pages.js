const fs = require('fs');
const path = require('path');

function slugify(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function pageTemplate(title, blurb, linksHtml, depth, backHref, sections = {}) {
  const homeHref = depth > 0 ? `${'../'.repeat(depth)}index.html` : 'index.html';
  const nav = [`<a href="${homeHref}" class="text-blue-200 hover:text-white">Home</a>`];
  if (backHref) nav.push(`<a href="${backHref}" class="text-blue-200 hover:text-white">Back</a>`);
  let sectionHtml = '';
  if (sections.why) {
    sectionHtml += `<h2 class="text-xl font-semibold mt-6">Why It Matters</h2>\n<p>${sections.why}</p>`;
  }
  if (sections.key && sections.key.length) {
    sectionHtml += `<h2 class="text-xl font-semibold mt-6">Key Concepts</h2>\n<ul class="list-disc ml-6">` +
      sections.key.map(k => `<li>${k}</li>`).join('\n') + '</ul>';
  }
  if (sections.examples && sections.examples.length) {
    sectionHtml += `<h2 class="text-xl font-semibold mt-6">Examples / Projects</h2>\n<ul class="list-disc ml-6">` +
      sections.examples.map(e => `<li>${e}</li>`).join('\n') + '</ul>';
  }
  if (sections.challenges && sections.challenges.length) {
    sectionHtml += `<h2 class="text-xl font-semibold mt-6">Challenges & Risks</h2>\n<ul class="list-disc ml-6">` +
      sections.challenges.map(c => `<li>${c}</li>`).join('\n') + '</ul>';
  }
  if (sections.resources && sections.resources.length) {
    sectionHtml += `<h2 class="text-xl font-semibold mt-6">Further Reading</h2>\n<ul class="list-disc ml-6">` +
      sections.resources.map(([t,u]) => `<li><a class="text-blue-600" href="${u}" target="_blank">${t}</a></li>`).join('\n') + '</ul>';
  }
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<title>${title}</title>
<script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-50 text-gray-800">
<header class="bg-gray-800 text-white p-4">
  <nav class="container mx-auto flex space-x-4">${nav.join('<span>|</span>')}</nav>
</header>
<main class="container mx-auto p-4">
<h1 class="text-3xl font-bold mb-4">${title}</h1>
<p>${blurb}</p>
${linksHtml}
${sectionHtml}
</main>
<footer class="bg-gray-100 text-center text-sm text-gray-500 py-4 mt-8">© 2024 Web3 Overview</footer>
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
  "Decentralization": {
    "Node Diversity": {
      blurb: "Many independent operators reduce capture risk.",
      sections: {
        why: "Diverse node operators make censorship or coordinated failure less likely.",
        key: [
          "Different clients and geographies prevent single points of failure",
          "Encourages open participation and resilience",
          "Balances performance with decentralization goals"
        ],
        examples: ["Ethereum’s multi-client ecosystem", "Bitcoin’s global miner distribution"],
        challenges: ["Hardware cost for running full nodes", "Centralized cloud hosting concentration"],
        resources: [
          ["Ethereum Client Diversity Initiative","https://ethereum.org/en/developers/docs/nodes-and-clients/"],
          ["Bitcoin Node Statistics","https://bitnodes.io/"]
        ]
      }
    },
    "Censorship Resistance": {
      blurb: "Hard to block transactions or exclude users.",
      sections: {
        why: "Ensures anyone can submit transactions without gatekeepers.",
        key: [
          "Validators include valid transactions regardless of origin",
          "Economic incentives discourage filtering",
          "Relies on distributed consensus rather than single operators"
        ],
        examples: ["Bitcoin’s open mempool", "MEV-Boost relays aiming for neutrality"],
        challenges: ["Regulatory pressure on block producers", "Network-level filtering by ISPs"],
        resources: [
          ["Ethereum and Censorship Resistance","https://ethereum.org/en/developers/docs/mev/"],
          ["Bitcoin Privacy and Censorship","https://bitcoin.org/en/privacy#censorship-resistance"]
        ]
      }
    },
    "Fault Tolerance": {
      blurb: "No single point whose failure halts the network.",
      sections: {
        why: "Redundancy in participants keeps the system running despite outages.",
        key: [
          "Replication of data across many nodes",
          "Consensus continues despite node churn",
          "Design for graceful degradation"
        ],
        examples: ["Bitcoin operating through regional outages", "IPFS content replication"],
        challenges: ["Coordinating upgrades across many nodes", "Handling network partitions"],
        resources: [
          ["Fault Tolerance in Distributed Systems","https://en.wikipedia.org/wiki/Fault_tolerance"],
          ["IPFS Whitepaper","https://ipfs.io/ipfs/QmR7GSQM93Cx5eAg6a6yRzSFAHFN5b8zuJ5U1ZbY4ZKqDW"]
        ]
      }
    },
    "Edge vs Cloud": {
      blurb: "Favor local control over centralized hosting.",
      sections: {
        why: "Running nodes on personal hardware reduces reliance on major cloud providers.",
        key: [
          "Edge nodes improve censorship resistance",
          "Local infrastructure avoids single-provider outages",
          "Community hosting fosters grassroots participation"
        ],
        examples: ["Home-hosted Ethereum validators", "Mesh networks for local block propagation"],
        challenges: ["Higher maintenance burden for individuals", "Residential bandwidth limitations"],
        resources: [
          ["Run an Ethereum Node","https://ethereum.org/en/run-a-node/"],
          ["Decentralization and Cloud Risks","https://blog.ethereum.org/2020/12/16/eth2-quick-update-no-25"]
        ]
      }
    },
    "Trade-offs": {
      blurb: "Latency, UX, and costs can rise with distribution.",
      sections: {
        why: "Decentralization introduces overhead that impacts performance and usability.",
        key: [
          "More nodes mean slower consensus",
          "Extra redundancy increases cost",
          "Designs must balance convenience and resilience"
        ],
        examples: ["Higher fees on decentralized networks", "Centralized exchanges offering faster UX"],
        challenges: ["User impatience with slow confirmations", "Pressure to recentralize for efficiency"],
        resources: [
          ["The Scalability Trilemma","https://vitalik.ca/general/2021/04/07/sharding.html"],
          ["Decentralization Trade-offs","https://ethereum.org/en/developers/docs/consensus-mechanisms/pos/"]
        ]
      }
    }
  },
  "Trust & Security": {
    "Cryptography Basics": {
      blurb: "Hashes, signatures, and Merkle proofs secure state.",
      sections: {
        why: "These primitives provide authentication, integrity, and tamper resistance for blockchain data.",
        key: [
          "Hashes link blocks and detect changes",
          "Digital signatures prove transaction authorship",
          "Merkle proofs verify inclusion without full data"
        ],
        examples: ["Bitcoin's SHA-256 chain", "Ethereum's account signatures"],
        challenges: ["Quantum threats to algorithms", "Poor randomness compromising keys"],
        resources: [
          ["Cryptographic Hash Function","https://en.wikipedia.org/wiki/Cryptographic_hash_function"],
          ["Merkle Tree","https://en.wikipedia.org/wiki/Merkle_tree"]
        ]
      }
    },
    "Key Management": {
      blurb: "Seed phrases, hardware wallets, MPC custody.",
      sections: {
        why: "Proper key management safeguards access to funds and identity.",
        key: [
          "Seed phrases back up private keys",
          "Hardware wallets isolate keys from malware",
          "MPC splits signing authority across parties"
        ],
        examples: ["Ledger hardware wallets", "Fireblocks MPC custody"],
        challenges: ["User errors causing loss of keys", "Centralized custody reintroducing trust"],
        resources: [
          ["Seed Phrase Best Practices","https://wiki.trezor.io/Passphrase"],
          ["MPC Overview","https://www.fireblocks.com/learn/what-is-mpc/"]
        ]
      }
    },
    "Audits": {
      blurb: "Independent reviews to catch vulnerabilities early.",
      sections: {
        why: "Audits detect smart contract bugs before deployment.",
        key: [
          "Review code line-by-line",
          "Report findings with severity and fixes",
          "Complement with formal verification"
        ],
        examples: ["OpenZeppelin audits", "Trail of Bits reviews"],
        challenges: ["Audits may miss zero-day bugs", "High cost limits small projects"],
        resources: [
          ["OpenZeppelin Security Audits","https://openzeppelin.com/security-audits/"],
          ["Trail of Bits Services","https://www.trailofbits.com/services/"]
        ]
      }
    },
    "Bug Bounties": {
      blurb: "Reward white-hats for responsible disclosure.",
      sections: {
        why: "Bounties incentivize finding vulnerabilities before attackers.",
        key: [
          "Programs define scope and payouts",
          "Reports verified and patched before public",
          "Platforms coordinate disclosure"
        ],
        examples: ["Immunefi bounty platform", "HackerOne blockchain programs"],
        challenges: ["Duplicate or low-quality submissions", "Balancing payout vs. budget"],
        resources: [
          ["Immunefi Platform","https://immunefi.com/"],
          ["HackerOne","https://hackerone.com/"]
        ]
      }
    },
    "Attack Vectors": {
      blurb: "Reentrancy, price oracles, MEV, governance attacks.",
      sections: {
        why: "Understanding exploits helps design safer protocols.",
        key: [
          "Reentrancy drains funds through recursive calls",
          "Oracle manipulation skews valuations",
          "Governance takeovers seize control"
        ],
        examples: ["The DAO reentrancy attack", "bZx oracle exploit"],
        challenges: ["Unknown zero-day vulnerabilities", "Complexity introduces new attack surfaces"],
        resources: [
          ["SWC Registry","https://swcregistry.io/"],
          ["MEV Exploits Overview","https://docs.flashbots.net/"]
        ]
      }
    }
  },
  "Identity & Privacy": {
    "DIDs & VCs": {
      blurb: "Decentralized identifiers and verifiable credentials.",
      sections: {
        why: "They enable portable, self-owned identities verified by third parties.",
        key: [
          "DIDs are unique identifiers without centralized registry",
          "VCs contain signed attestations",
          "Holders present proofs to verifiers"
        ],
        examples: ["W3C DID spec implementations", "Ethereum Name Service"],
        challenges: ["Interoperability between DID methods", "Revocation and key rotation"],
        resources: [
          ["W3C DID Specification","https://www.w3.org/TR/did-core/"],
          ["Verifiable Credentials Data Model","https://www.w3.org/TR/vc-data-model/"]
        ]
      }
    },
    "Selective Disclosure": {
      blurb: "Prove attributes without leaking everything.",
      sections: {
        why: "Minimizes data exposure while establishing trust.",
        key: [
          "Zero-knowledge proofs reveal only needed facts",
          "Attribute-based credentials prove specific claims",
          "Users control what is shared"
        ],
        examples: ["zk-SNARK based age proofs", "Idemix credential system"],
        challenges: ["Complex cryptographic circuits", "Verifier support and standardization"],
        resources: [
          ["Selective Disclosure with ZK","https://iden3.io/docs/protocol/selective-disclosure/"],
          ["Idemix","https://www.zurich.ibm.com/idemix/"]
        ]
      }
    },
    "Zero-Knowledge": {
      blurb: "ZKPs enable private yet verifiable statements.",
      sections: {
        why: "ZK proofs allow verifying computation without revealing inputs.",
        key: [
          "Proofs show knowledge without disclosure",
          "Succinct proofs compress computation",
          "Applications include privacy and scalability"
        ],
        examples: ["zkSync rollups", "Zcash shielded transactions"],
        challenges: ["Trusted setup ceremony risks", "High prover computational cost"],
        resources: [
          ["Zcash Protocol","https://z.cash/technology/"],
          ["zkSync Docs","https://docs.zksync.io/"]
        ]
      }
    },
    "Reputation Graphs": {
      blurb: "On-chain history and attestations signal trust.",
      sections: {
        why: "Reputation data helps apps evaluate reliability of participants.",
        key: [
          "Attestations accumulate over time",
          "Graph connections reveal relationships",
          "Used for credit scoring and moderation"
        ],
        examples: ["Lens Protocol social graph", "Gitcoin Passport attestations"],
        challenges: ["Sybil attacks inflate reputation", "Privacy concerns from public histories"],
        resources: [
          ["Lens Protocol","https://lens.xyz/"],
          ["Gitcoin Passport","https://passport.gitcoin.co/"]
        ]
      }
    },
    "UX of Keys": {
      blurb: "Recovery, social guardians, and account abstraction.",
      sections: {
        why: "Improving key UX reduces user loss and boosts adoption.",
        key: [
          "Social recovery uses trusted guardians",
          "Account abstraction hides key management",
          "Multi-factor flows balance security with convenience"
        ],
        examples: ["Argent social recovery wallets", "Safe's account abstraction"],
        challenges: ["Guardian collusion or loss", "Complex standards adoption"],
        resources: [
          ["Argent Wallet","https://www.argent.xyz/"],
          ["ERC-4337 Account Abstraction","https://eips.ethereum.org/EIPS/eip-4337"]
        ]
      }
    }
  },
  "Governance & DAOs": {
    "Voting Systems": {
      blurb: "1-token-1-vote, quadratic, conviction voting, etc.",
      sections: {
        why: "Voting mechanisms define how collective decisions are made.",
        key: [
          "Token-weighted voting reflects stake",
          "Quadratic voting mitigates whale dominance",
          "Conviction voting accumulates support over time"
        ],
        examples: ["Compound token voting", "Gitcoin quadratic funding"],
        challenges: ["Low participation leading to capture", "Sybil attacks or bribery"],
        resources: [
          ["Compound Governance","https://compound.finance/governance"],
          ["Quadratic Voting Explained","https://vitalik.ca/general/2019/12/07/quadratic.html"]
        ]
      }
    },
    "Delegation": {
      blurb: "Elect stewards to scale decisions and expertise.",
      sections: {
        why: "Delegation enables governance by representatives for efficiency.",
        key: [
          "Token holders assign voting power to delegates",
          "Delegates act transparently on behalf of others",
          "Re-delegation allows changing representatives"
        ],
        examples: ["Uniswap delegate system", "Gitcoin steward program"],
        challenges: ["Delegate apathy or concentration", "Information asymmetry"],
        resources: [
          ["Uniswap Governance Delegation","https://docs.uniswap.org/contracts/v2/guides/governance/delegation"],
          ["Gitcoin Governance","https://gov.gitcoin.co/"]
        ]
      }
    },
    "Constitution": {
      blurb: "Rules of change and conflict resolution on-chain.",
      sections: {
        why: "Explicit constitutions define governance scope and amendment processes.",
        key: [
          "Outline proposals and quorum requirements",
          "Set dispute resolution mechanisms",
          "Provide clarity to participants"
        ],
        examples: ["ENS DAO constitution", "MakerDAO governance charter"],
        challenges: ["Hard to adapt to unforeseen events", "Enforcement relies on social consensus"],
        resources: [
          ["ENS DAO Constitution","https://docs.ens.domains/dao/constitution"],
          ["Maker Governance Docs","https://manual.makerdao.com/governance"]
        ]
      }
    },
    "Treasury Controls": {
      blurb: "Safeguards, multisigs, timelocks, and audits.",
      sections: {
        why: "Securing treasury assets protects community funds.",
        key: [
          "Multisig wallets require multiple approvals",
          "Timelocks delay actions for review",
          "Audits and reporting add transparency"
        ],
        examples: ["Gnosis Safe multisig", "Compound's timelocked governance"],
        challenges: ["Coordination delays for urgent actions", "Keyholder compromise"],
        resources: [
          ["Gnosis Safe","https://gnosis-safe.io/"],
          ["Compound Timelock","https://docs.compound.finance/#timelock"]
        ]
      }
    },
    "Participation": {
      blurb: "Incentives and rituals that keep members engaged.",
      sections: {
        why: "Active participation ensures legitimacy and diverse input.",
        key: [
          "Reward programs motivate involvement",
          "Regular calls and forums build community",
          "Clear roles encourage contribution"
        ],
        examples: ["DAO contributor reward systems", "Snapshot voting with incentives"],
        challenges: ["Volunteer fatigue", "Voter apathy"],
        resources: [
          ["Snapshot","https://snapshot.org/"],
          ["Ethereum.org DAO Guide","https://ethereum.org/en/dao/"]
        ]
      }
    }
  },
  "Interoperability": {
    "Bridges": {
      blurb: "Move assets/messages across chains securely.",
      sections: {
        why: "Bridges connect isolated ecosystems for liquidity and data transfer.",
        key: [
          "Lock-and-mint or burn-and-release mechanisms",
          "Relayers or validators verify cross-chain events",
          "Security varies with trust assumptions"
        ],
        examples: ["Wormhole bridge", "Axelar cross-chain network"],
        challenges: ["Bridge hacks from compromised validators", "Liquidity fragmentation"],
        resources: [
          ["Wormhole Docs","https://docs.wormhole.com/"],
          ["Axelar Network","https://www.axelar.network/"]
        ]
      }
    },
    "Standards": {
      blurb: "Common token and contract interfaces reduce friction.",
      sections: {
        why: "Shared standards enable composability across protocols.",
        key: [
          "ERCs define token behaviors",
          "Interface IDs allow detection and compatibility",
          "Community review improves robustness"
        ],
        examples: ["ERC-20 token standard", "ERC-721 for NFTs"],
        challenges: ["Slow standardization process", "Version fragmentation"],
        resources: [
          ["Ethereum Improvement Proposals","https://eips.ethereum.org/"],
          ["OpenZeppelin Contracts","https://github.com/OpenZeppelin/openzeppelin-contracts"]
        ]
      }
    },
    "Shared Security": {
      blurb: "Consumer chains borrow security from a hub.",
      sections: {
        why: "Shared security allows new chains to leverage established validator sets.",
        key: [
          "Hub provides validator set and staking",
          "Consumer chain submits state proofs",
          "Reduces bootstrap cost"
        ],
        examples: ["Cosmos Hub's interchain security", "Polkadot parachains"],
        challenges: ["Coupling reduces sovereignty", "Complex slashing propagation"],
        resources: [
          ["Cosmos Interchain Security","https://docs.cosmos.network/main/interchain-security/"],
          ["Polkadot Parachains","https://wiki.polkadot.network/docs/learn-parachains"]
        ]
      }
    },
    "Cross-chain Apps": {
      blurb: "Single UX spanning multiple networks.",
      sections: {
        why: "Users interact with multiple chains through unified interfaces.",
        key: [
          "Abstracts away bridge steps",
          "Aggregates liquidity from different chains",
          "Requires message passing standards"
        ],
        examples: ["THORChain multi-chain swaps", "Li.Fi bridge aggregator"],
        challenges: ["Complex state synchronization", "Increased attack surface"],
        resources: [
          ["THORChain Docs","https://docs.thorchain.org/"],
          ["Li.Fi Docs","https://docs.li.fi/"]
        ]
      }
    },
    "Risks": {
      blurb: "Bridge exploits and fragmented liquidity.",
      sections: {
        why: "Interoperability introduces new security and economic vulnerabilities.",
        key: [
          "Bridges create honeypots",
          "Inconsistent standards lead to errors",
          "Liquidity split reduces efficiency"
        ],
        examples: ["Ronin bridge hack", "Harmony Horizon exploit"],
        challenges: ["Difficult to audit cross-chain logic", "User confusion over wrapped assets"],
        resources: [
          ["Ronin Hack Postmortem","https://blog.chainalysis.com/reports/ronin-bridge-hack/"],
          ["Harmony Horizon Attack","https://medium.com/harmony-one/horizon-bridge-incident-analysis-1ce038d2cd75"]
        ]
      }
    }
  },

  "Layer-1 Blockchains": [
    ["Execution","How transactions run (EVM, WASM, parallelism)."],
    ["Data Availability","Guarantee that block data is retrievable."],
    ["Finality","Economic or probabilistic guarantees of permanence."],
    ["Client Diversity","Multiple implementations reduce correlated bugs."],
    ["Token Utility","Fee, staking, governance use for native token."],
  ],
  "Layer-2 Scalability": [
    ["Optimistic Rollups","Assume validity; fraud proofs challenge bad blocks."],
    ["ZK Rollups","Validity proofs ensure correctness without re-execution."],
    ["State Channels","Peer sets transact off-chain, settle periodically."],
    ["Shared Sequencing","Fair ordering and reduced MEV on L2s."],
    ["Bridging UX","Fast exits, liquidity providers, security caveats."],
  ],
  "Consensus Mechanisms": {
    "PoS Staking": {
      blurb: "Validators bond tokens and get slashed for faults.",
      sections: {
        why: "Proof-of-stake secures networks with economic penalties instead of energy use.",
        key: [
          "Validators lock stake to participate",
          "Rewards incentivize honest behavior",
          "Slashing deters double-signing and downtime"
        ],
        examples: ["Ethereum's Beacon Chain", "Cosmos staking"],
        challenges: ["Capital requirement centralizes validators", "Complex withdrawal mechanics"],
        resources: [
          ["Ethereum Staking Guide","https://ethereum.org/en/staking/"],
          ["Cosmos Staking","https://docs.cosmos.network/main/hub/validators/overview.html"]
        ]
      }
    },
    "Leader Election": {
      blurb: "VRF/round-robin select block proposers fairly.",
      sections: {
        why: "Choosing who creates the next block impacts fairness and security.",
        key: [
          "VRFs provide unpredictable yet verifiable randomness",
          "Round-robin ensures equal opportunity",
          "Weighted schemes account for stake or reputation"
        ],
        examples: ["Algorand's VRF selection", "Tendermint round-robin"],
        challenges: ["Manipulating randomness sources", "Ensuring liveness with offline leaders"],
        resources: [
          ["Algorand Consensus","https://www.algorand.com/technology/algorand-consensus"],
          ["Tendermint Core","https://docs.tendermint.com/"]
        ]
      }
    },
    "Finality Gadgets": {
      blurb: "Checkpoint mechanisms to lock history.",
      sections: {
        why: "Additional layers provide faster or stronger guarantees of finality.",
        key: [
          "Overlay on base consensus to finalize blocks",
          "Reduces chance of reorgs",
          "Often used in hybrid protocols"
        ],
        examples: ["Ethereum's Casper FFG", "Polkadot GRANDPA"],
        challenges: ["Complexity of multiple consensus layers", "Handling misbehavior during finalization"],
        resources: [
          ["Casper FFG","https://arxiv.org/abs/1710.09437"],
          ["Polkadot Finality","https://wiki.polkadot.network/docs/learn-consensus"]
        ]
      }
    },
    "Sybil Resistance": {
      blurb: "Costs (stake/work/identity) deter spam.",
      sections: {
        why: "Networks need a way to limit pseudonymous identities from overwhelming systems.",
        key: [
          "Proof of work expends energy",
          "Proof of stake locks capital",
          "Identity-based methods use credentials"
        ],
        examples: ["Hashcash in Bitcoin", "BrightID for identity"],
        challenges: ["Environmental impact of PoW", "Concentrated stake controlling PoS"],
        resources: [
          ["Sybil Attack Definition","https://en.wikipedia.org/wiki/Sybil_attack"],
          ["BrightID","https://www.brightid.org/"]
        ]
      }
    },
    "Incentive Design": {
      blurb: "Rewards and penalties align honest behavior.",
      sections: {
        why: "Economic incentives ensure participants follow the protocol rules.",
        key: [
          "Rewards compensate validators",
          "Slashing discourages malicious acts",
          "Game theory models analyze rational choices"
        ],
        examples: ["Ethereum reward curves", "Polkadot staking economics"],
        challenges: ["Balancing inflation with security", "Adapting incentives to changing conditions"],
        resources: [
          ["Mechanism Design for Blockchain","https://cs.uwaterloo.ca/~yao/misc/cryptoecon.pdf"],
          ["Polkadot Economics","https://wiki.polkadot.network/docs/learn-staking"]
        ]
      }
    }
  },
  "Storage & Data": [
    ["IPFS Basics","Content addressing with hashes, not locations."],
    ["Filecoin/Economics","Markets that pay for durable storage."],
    ["Indexing/Subgraphs","Queryable views for dApps."],
    ["Data Availability Layers","Specialized chains for blob/data posting."],
    ["Privacy Layers","Encrypted storage and access control."],
  ],
  "Networking & Nodes": [
    ["P2P Gossip","Propagate blocks/tx quickly and reliably."],
    ["Light Clients","Verify with minimal resources (SPV/ZK-LC)."],
    ["Validator Ops","Uptime, monitoring, backups, key safety."],
    ["RPC & Infra","Gateways, rate limits, and decentralization."],
    ["Observability","Mempool, logs, metrics, and alerts."],
  ],

  "Languages & VMs": [
    ["Type Safety","Catch bugs earlier; avoid foot-guns."],
    ["Gas Model","Meter computation/storage to prevent abuse."],
    ["WASM Runtimes","Multi-language smart contracts via WASM."],
    ["Parallel Execution","Increase throughput with safe concurrency."],
    ["Toolchains","Compilers, linters, formatters, IDE support."],
  ],
  "Oracles & Off-chain": [
    ["Price Feeds","Reliable asset prices for DeFi protocols."],
    ["Compute Networks","Off-chain tasks with verifiable outputs."],
    ["Randomness","Unbiasable randomness for lotteries/games."],
    ["Bridge Security","Economic security and multi-sig risks."],
    ["Data Integrity","Signing, attestation, replay protection."],
  ],
  "Standards & Interfaces": [
    ["ERC-20","Fungible token interface for transfers/allowance."],
    ["ERC-721/1155","Non-fungible and semi-fungible standards."],
    ["Permit/EIP-2612","Gasless approvals via signatures."],
    ["Meta-Tx","Relayers pay gas; better UX."],
    ["Composability","Plug-and-play across protocols."],
  ],
  "Verification & Testing": [
    ["Unit/Property Tests","Check behavior and invariants."],
    ["Fuzzing","Generate random inputs to find edge cases."],
    ["Symbolic Exec","Explore paths mathematically for bugs."],
    ["Formal Proofs","Machine-checked correctness proofs."],
    ["Runtime Guards","Circuit breakers, pause switches, rate limits."],
  ],
  "Upgradeability & Patterns": [
    ["Proxy Pattern","Separate logic and storage for upgrades."],
    ["Governance Gates","Timelocks and voting for changes."],
    ["Migration Plans","Safely move funds/state to new versions."],
    ["Modularity","Composable components reduce risk."],
    ["Backward Compat","Avoid breaking dependents."],
  ],

  "Fungible Tokens": [
    ["Utility","Pay fees, access services, or reward usage."],
    ["Governance","Vote on parameters, elect delegates."],
    ["Liquidity","Pools enable trading and price discovery."],
    ["Distribution","Airdrops, sales, and vesting schedules."],
    ["Compliance","Transfer restrictions, blacklists, disclosures."],
  ],
  "Non-Fungible Tokens (NFTs)": [
    ["Metadata","On/off-chain storage and mutability choices."],
    ["Royalties","Creator revenue models and enforcement."],
    ["Tickets/Access","Memberships and event passes."],
    ["Identity","Soulbound/attestation-style credentials."],
    ["RWAs","Tokenize property, collectibles, certificates."],
  ],
  "Stablecoins": [
    ["Fiat-Backed","Off-chain reserves and attestations."],
    ["Crypto-Collateral","Over-collateralized, on-chain transparency."],
    ["Algorithmic","Supply rules target a peg (high risk)."],
    ["Payment Rails","Low-cost global settlement."],
    ["Policy Risks","Regulatory oversight and bank integration."],
  ],
  "Treasury & DAOs": [
    ["Budgeting","Fund roadmaps, grants, and ops."],
    ["Diversification","Manage exposure and risk."],
    ["Transparency","On-chain accounting and dashboards."],
    ["Security","Multisigs, MPC, insurance coverage."],
    ["Compensation","Contributor rewards and vesting."],
  ],
  "Incentives & Game Theory": [
    ["Staking","Lock tokens for yield and security."],
    ["Liquidity Mining","Reward LPs for providing depth."],
    ["Fee Sharing","Split protocol revenues with users."],
    ["Anti-Sybil","Deter fake accounts and farming."],
    ["Sustainability","Avoid ponzinomics; align long-term."],
  ],

  "DeFi": {
    "DEXs": {
      blurb: "AMMs and order books for swaps.",
      sections: {
        why: "Decentralized exchanges allow peer-to-peer trading without custodians.",
        key: [
          "Automated market makers provide liquidity",
          "Order books enable professional trading",
          "Smart contracts execute swaps transparently"
        ],
        examples: ["Uniswap", "dYdX"],
        challenges: ["Impermanent loss for LPs", "Front-running and MEV"],
        resources: [
          ["Uniswap Docs","https://docs.uniswap.org/"],
          ["dYdX Exchange","https://dydx.exchange/"],
        ]
      }
    },
    "Lending": {
      blurb: "Over-collateralized loans and credit primitives.",
      sections: {
        why: "On-chain lending allows capital efficiency without intermediaries.",
        key: [
          "Collateral backs loans to manage risk",
          "Interest rates adjust via supply and demand",
          "Liquidations protect lenders"
        ],
        examples: ["Aave", "Compound"],
        challenges: ["Oracle failures causing bad liquidations", "Capital inefficiency from over-collateralization"],
        resources: [
          ["Aave Docs","https://docs.aave.com/"],
          ["Compound Protocol","https://compound.finance/"]
        ]
      }
    },
    "Derivatives": {
      blurb: "Perps, options, and structured products.",
      sections: {
        why: "Derivative markets provide hedging and speculation tools in DeFi.",
        key: [
          "Perpetual swaps track index prices",
          "Options offer asymmetric payoffs",
          "Structured products bundle strategies"
        ],
        examples: ["Perpetual Protocol", "Opyn options"],
        challenges: ["Margin management complexity", "Smart contract risk in leverage"],
        resources: [
          ["Perpetual Protocol Docs","https://docs.perp.com/"],
          ["Opyn Documentation","https://docs.opyn.co/"],
        ]
      }
    },
    "Asset Management": {
      blurb: "Vaults and auto-rebalancing strategies.",
      sections: {
        why: "Automated strategies help users optimize yield and diversify portfolios.",
        key: [
          "Vaults aggregate funds for strategies",
          "Rebalancing maintains target allocations",
          "Fees compensate strategists"
        ],
        examples: ["Yearn Finance", "Set Protocol"],
        challenges: ["Smart contract bugs", "Strategy underperformance"],
        resources: [
          ["Yearn Docs","https://docs.yearn.finance/"],
          ["Set Protocol","https://www.tokensets.com/"],
        ]
      }
    },
    "Risk Management": {
      blurb: "Oracles, LTVs, liquidations, insurance.",
      sections: {
        why: "Managing risk is essential to protect users and protocols in DeFi.",
        key: [
          "Loan-to-value ratios cap leverage",
          "Reliable oracles feed market data",
          "Insurance pools cover smart contract failures"
        ],
        examples: ["MakerDAO's liquidation system", "Nexus Mutual insurance"],
        challenges: ["Black swan market moves", "Correlated collateral risks"],
        resources: [
          ["MakerDAO Docs","https://docs.makerdao.com/"],
          ["Nexus Mutual","https://nexusmutual.io/"],
        ]
      }
    }
  },
  "Web3 Social": [
    ["Portable Handles","Usernames/IDs you can take anywhere."],
    ["Social Graphs","Open, user-owned follower relations."],
    ["Creator Monetization","Tokens, tipping, and revenue shares."],
    ["Moderation","Community rules, client-side filters."],
    ["Interoperable Feeds","Multiple apps over the same graph."],
  ],
  "Gaming & Metaverse": [
    ["Asset Ownership","Players truly own items/skins."],
    ["Economy Design","Sinks/sources and inflation control."],
    ["Interoperability","Use assets across games/worlds."],
    ["On/Off-chain Mix","Latency-friendly hybrids for UX."],
    ["Anti-Cheat","Proofs and attestations for fairness."],
  ],
  "Supply Chain & RWAs": [
    ["Provenance","Track origin and custody changes."],
    ["Tokenization","On-chain representation of assets."],
    ["Compliance Rails","Whitelists and attested participants."],
    ["Oracles","Verified real-world events and data."],
    ["Settlement","Atomic delivery-versus-payment."],
  ],
  "Regulation & Compliance": [
    ["KYC/AML","Know-your-customer and anti-laundering checks."],
    ["Travel Rule","Share originator/beneficiary data between VASPs."],
    ["Licensing","Exchange/custody requirements by jurisdiction."],
    ["Taxation","Gains, reporting, and cost basis."],
    ["Policy Trends","Global coordination and sandboxes."],
  ],
};

function defaultSections(title, blurb) {
  return {
    why: blurb,
    key: [
      `Definition and role of ${title}`,
      `How ${title} fits into Web3`,
      `Considerations when using ${title}`
    ],
    examples: [`Example projects using ${title}`],
    challenges: [`Challenges around ${title}`],
    resources: []
  };
}

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
  const l4 = curatedL4[node.title];
  if (l4) {
    links += '<ul>\n';
    if (Array.isArray(l4)) {
      l4.forEach(([title, blurb]) => {
        const slug = slugify(title);
        links += `  <li><a href="${slug}.html">${title}</a></li>\n`;
        const l4Html = pageTemplate(title, blurb, '', depth, 'index.html', defaultSections(title, blurb));
        fs.writeFileSync(path.join(dir, `${slug}.html`), l4Html);
      });
    } else {
      Object.entries(l4).forEach(([title, entry]) => {
        const slug = slugify(title);
        links += `  <li><a href="${slug}.html">${title}</a></li>\n`;
        const sections = entry.sections || defaultSections(title, entry.blurb);
        const l4Html = pageTemplate(title, entry.blurb, '', depth, 'index.html', sections);
        fs.writeFileSync(path.join(dir, `${slug}.html`), l4Html);
      });
    }
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
