import type { ReactNode } from 'react'
import { CHAIN, CONTRACTS, LINKS } from '../content/site'
import { DOC_META, type DocMeta } from './meta'
import { Address, Callout, Ext, H2, Todo } from './ui'

export { pagePath } from './meta'

/*
 * The docs' page bodies, keyed by slug. Titles, groups, leads and order live
 * in meta.ts.
 *
 * Source of truth is the live app (app.usecrossp2p.com, read 8 Oct 2026:
 * Board, Create order, OTC desk + Propose, Trust, Referrals, Savings, My
 * orders, History, How it works) and the facts already on the site. Nothing
 * here is invented: anything the app doesn't show is a <Todo>.
 */

export type DocPage = DocMeta & { body: () => ReactNode }

const APP = LINKS.app

const BODIES: { slug: string; body: () => ReactNode }[] = [
  {
    slug: '',
    body: () => (
      <>
        <H2>What Cross is</H2>
        <p>
          On Cross you trade directly with another person. An escrow contract holds both sides and swaps them in one transaction. It's live
          first on {CHAIN.name}.
        </p>
        <p>
          A seller locks tokens in escrow and names a price. A buyer takes it, or doesn't. That's the whole idea. Any {CHAIN.name} token can be
          listed, and you pay in ETH or USDG.
        </p>

        <H2>P2P vs pools</H2>
        <p>Most onchain trading goes through a pool. Cross doesn't use one. Here's what changes.</p>
        <div className="docs-table">
          <table>
            <thead>
              <tr>
                <th />
                <th>DEX pool</th>
                <th>Cross</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Price impact</td>
                <td>Grows with size</td>
                <td className="docs-good">0.00%</td>
              </tr>
              <tr>
                <td>Slippage</td>
                <td>Yes</td>
                <td className="docs-good">None</td>
              </tr>
              <tr>
                <td>Launchpad tax</td>
                <td>Often</td>
                <td className="docs-good">None</td>
              </tr>
              <tr>
                <td>Fee</td>
                <td>0.05% to 1%</td>
                <td>0.5%, buyer pays</td>
              </tr>
            </tbody>
          </table>
        </div>

        <H2>Why there's no price impact or slippage</H2>
        <p>
          A pool sets the price with a formula. Every trade moves it. The bigger your trade, the further the price moves against you before
          your trade is done. That's price impact. If the price moves between when you click and when your trade lands, that's slippage.
        </p>
        <p>
          On Cross the price is agreed first. The seller sets it, and the buyer pays exactly that, plus the fee. Size doesn't change it, and
          nothing between click and settlement can either. A trade on Cross also doesn't touch the token's price in any pool.
        </p>
        <p>
          Want to see the difference for a real size? The <Ext href={`${APP}/simulator`}>Savings</Ext> page in the app quotes the same trade
          against the Uniswap v3 pools on {CHAIN.name}, live.
        </p>

        <H2>What you can do</H2>
        <ul>
          <li>
            <a href="/docs/trading/fill">Fill an order</a> from the Board.
          </li>
          <li>
            <a href="/docs/trading/create">Create an order</a> at your own price.
          </li>
          <li>
            Trade big stock-paired blocks on the <a href="/docs/otc">OTC desk</a>.
          </li>
          <li>
            <a href="/docs/token-trust">Check a token</a> before you trade it.
          </li>
          <li>
            <a href="/docs/referrals">Refer people</a> and earn part of the fee.
          </li>
        </ul>

        <Callout tone="warn" title="Early days">
          The contracts are internally tested and the audit is pending. Until then, each order is capped at 2 ETH. Nothing here is financial
          advice.
        </Callout>
      </>
    ),
  },
  {
    slug: 'getting-started',
    body: () => (
      <>
        <H2>What you need</H2>
        <ul>
          <li>
            A browser wallet. The app connects to an injected wallet, meaning one that runs as a browser extension. <Todo>name the wallets
            you've tested</Todo>
          </li>
          <li>
            {CHAIN.name} added to that wallet. Its chain ID is <code>{CHAIN.id}</code>.
          </li>
          <li>ETH or USDG on {CHAIN.name} if you want to buy, or the tokens you want to sell.</li>
          <li>
            Something to pay network fees with. <Todo>confirm the gas token on {CHAIN.name}</Todo>
          </li>
        </ul>

        <H2>Connect your wallet</H2>
        <ol>
          <li>
            Open <Ext href={APP}>app.usecrossp2p.com</Ext>.
          </li>
          <li>
            Click <strong>Connect wallet</strong> in the top right and choose <strong>Injected</strong>.
          </li>
          <li>Approve the connection in your wallet.</li>
          <li>
            Check the network menu next to it says <strong>{CHAIN.name}</strong>.
          </li>
        </ol>
        <p>
          Once you're connected, <strong>My orders</strong> shows the orders you posted, filled, or were invited to.
        </p>

        <H2>Add Robinhood Chain</H2>
        <p>If your wallet doesn't know the network yet, add it with these details.</p>
        <div className="docs-table">
          <table>
            <tbody>
              <tr>
                <td>Network name</td>
                <td>{CHAIN.name}</td>
              </tr>
              <tr>
                <td>Chain ID</td>
                <td>
                  <code>{CHAIN.id}</code>
                </td>
              </tr>
              <tr>
                <td>RPC URL</td>
                <td>
                  <Todo />
                </td>
              </tr>
              <tr>
                <td>Currency symbol</td>
                <td>
                  <Todo />
                </td>
              </tr>
              <tr>
                <td>Block explorer</td>
                <td>
                  <Ext href="https://robinhoodchain.blockscout.com">robinhoodchain.blockscout.com</Ext>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          <Todo>say whether the app offers to add or switch the network for you</Todo>
        </p>

        <H2>Get ETH or USDG on Robinhood Chain</H2>
        <p>Buyers pay in ETH or USDG, and sellers choose which one they get paid in. You need it on {CHAIN.name} itself.</p>
        <p>
          <Todo>official bridge or on-ramp for ETH and USDG onto {CHAIN.name}, with links</Todo>
        </p>
        <Callout tone="warn">
          Only use links you trust to move funds between chains. If you're not sure a bridge is the right one, ask before you send.
        </Callout>

        <H2>Next steps</H2>
        <ul>
          <li>
            <a href="/docs/trading/fill">Fill an order</a>
          </li>
          <li>
            <a href="/docs/trading/create">Create an order</a>
          </li>
        </ul>
      </>
    ),
  },
  {
    slug: 'trading/fill',
    body: () => (
      <>
        <H2>The Board</H2>
        <p>
          The Board is the app's home page. It lists every open public order: the token, how much is left, the price, the value, how much has
          filled, the order type, the seller, and when it was posted and expires.
        </p>
        <p>
          You can filter it to all, public, private or partial-fill orders, sort by newest, size or price, and narrow it to one token. The
          strip under the list shows current prices from Chainlink on {CHAIN.name}.
        </p>

        <H2>Fill an order</H2>
        <ol>
          <li>Pick an order on the Board.</li>
          <li>
            Check the token. Look at its address and its <a href="/docs/token-trust">trust checks</a>, not just the ticker.
          </li>
          <li>
            Choose how much to buy, if the seller allowed partial fills. <Todo>describe the fill ticket: fields, approvals, buttons</Todo>
          </li>
          <li>Confirm. You pay the price plus the 0.5% fee.</li>
        </ol>
        <p>
          The contract hands you the tokens and pays the seller in the same transaction. Either both happen, or neither does.
        </p>

        <H2>Partial fills</H2>
        <p>
          If the seller allowed partial fills, you can buy part of an order. Several buyers can split one order. The seller can set a minimum
          per fill.
        </p>

        <H2>Private orders</H2>
        <p>
          A private order only shows to the wallets the seller invited, and only they can fill it. If you were invited, you'll find it under
          <strong> My orders</strong>.
        </p>

        <Callout tone="warn" title="Check the address">
          Anyone can list any token. A token with a matching ticker but a different address is a different token.
        </Callout>
      </>
    ),
  },
  {
    slug: 'trading/create',
    body: () => (
      <>
        <H2>Post an order</H2>
        <ol>
          <li>
            Open <Ext href={`${APP}/create`}>Create order</Ext>.
          </li>
          <li>Pick the token to sell. NVDA, AAPL and TSLA are one click, or paste any {CHAIN.name} ERC-20 contract address.</li>
          <li>Choose what you get paid in: ETH or USDG.</li>
          <li>Enter the amount and your price per token.</li>
          <li>Set the options below if you want them.</li>
          <li>
            Click <strong>Lock tokens &amp; post order</strong>. Your tokens move into the escrow contract and the order goes live.
          </li>
        </ol>
        <p>
          While you fill in the form, it shows the token's trust checks and what a buyer would save compared with a DEX.
        </p>

        <H2>Price</H2>
        <p>
          You set the price per token. The form shows the current spot price next to the field, and quick buttons for −5%, −2%, spot, +2% and
          +5%. You can type any price you like. Buyers pay exactly that.
        </p>

        <H2>Amount</H2>
        <p>
          Enter how many tokens to sell. The form shows the order value as you type. Until the audit is done, one order can be worth at most 2
          ETH.
        </p>

        <H2>Partial fills</H2>
        <p>
          Tick <strong>Allow partial fills</strong> to let several buyers split the order. You can also set a minimum per fill, so nobody takes
          a tiny piece. Leave it off and the order fills all at once or not at all.
        </p>

        <H2>Private orders</H2>
        <p>
          Tick <strong>Private order</strong> to hide the order from the public Board. Add at least one wallet to invite. Only invited wallets
          can see it and fill it.
        </p>

        <H2>Expiry</H2>
        <p>
          Set <strong>Expires after</strong> in hours. Enter 0 and it never expires. <Todo>say what happens to unfilled tokens when an order
          expires: returned automatically, or withdrawn by the seller</Todo>
        </p>

        <H2>What it costs you</H2>
        <p>
          Nothing, as the seller. The 0.5% fee is paid by the buyer, on top of your price. You receive your full price. See{' '}
          <a href="/docs/fees">Fees</a>.
        </p>
      </>
    ),
  },
  {
    slug: 'trading/cancel',
    body: () => (
      <>
        <H2>How cancelling works</H2>
        <p>
          You can cancel your order whenever you like. Whatever hasn't filled comes back to you straight away. If part of it already sold, you
          keep the payment for that part and get the rest of your tokens back.
        </p>
        <p>
          Only you can do this. No one else can move tokens in escrow, Cross included.
        </p>

        <H2>Cancel an order</H2>
        <ol>
          <li>
            Open <Ext href={`${APP}/my`}>My orders</Ext> with the wallet that posted it.
          </li>
          <li>
            Find the order and cancel it. <Todo>confirm the button name and where it is</Todo>
          </li>
          <li>Confirm in your wallet.</li>
        </ol>

        <Callout title="Even if trading is paused">
          The operator can pause new activity, but your unfilled tokens stay withdrawable by you. Nothing gets stuck.
        </Callout>
      </>
    ),
  },
  {
    slug: 'otc',
    body: () => (
      <>
        <H2>What it's for</H2>
        <p>
          The OTC desk is for big stock-paired positions. Today that's NVDA, AAPL and TSLA, the tokens the OTC escrow contract accepts. Prices
          are in ETH per token, and the desk shows a Chainlink mark next to every listing.
        </p>
        <p>A block trade on the desk never moves the token's onchain price.</p>

        <H2>Asks and bids</H2>
        <p>
          Post an <strong>ask</strong> to sell or a <strong>bid</strong> to buy. Set the size in tokens and your price in ETH per token. The form
          has quick buttons for −2%, −1%, the mark, +1% and +2%.
        </p>
        <p>
          You can also tick <strong>Fund my leg now</strong>. That locks your price, and anyone can take the deal by funding their side.
        </p>

        <H2>Counters</H2>
        <p>
          Not happy with the price? Counter it onchain. Talk it over offchain if you need to. <Todo>where off-chain chat happens</Todo>
        </p>
        <p>The maker accepts one counter. That locks the price and the counterparty.</p>

        <H2>Both sides pay in</H2>
        <p>
          The seller deposits the tokens. The buyer deposits ETH plus the fee. The moment the second side lands, the contract swaps both in
          one transaction.
        </p>

        <H2>Time limits</H2>
        <ul>
          <li>
            <strong>72 hours.</strong> A listing nobody takes disappears after 72 hours.
          </li>
          <li>
            <strong>24 hours.</strong> If you've paid in and the other side hasn't, you can reclaim your deposit in full after 24 hours.
          </li>
          <li>
            <strong>Any time.</strong> A side that hasn't paid in can walk away whenever it likes, and the other side gets refunded.
          </li>
        </ul>

        <H2>Fees and caps</H2>
        <p>
          The fee is 0.5%, paid by the buyer at settlement. Until the audit is done, each deal is capped at 2 ETH.
        </p>
      </>
    ),
  },
  {
    slug: 'fees',
    body: () => (
      <>
        <H2>The trading fee</H2>
        <p>
          When a trade fills, the buyer pays 0.5% of the notional on top of the price. That goes for orders and for OTC deals. The seller pays
          no fee and receives their full price.
        </p>
        <p>For example, if you buy 1 ETH worth of tokens, you pay 1.005 ETH. The seller gets 1 ETH.</p>
        <p>There's no fee to post, cancel, or let an order expire. You only pay when something fills.</p>

        <H2>The 2% cap</H2>
        <p>
          The operator can change the fee, but the contract won't let it go above 2%. The exact rate is set onchain and shown on every ticket
          before you confirm.
        </p>

        <H2>Where the fee goes</H2>
        <p>
          20% of the fee goes to referrers, which is 0.1% of the notional. See <a href="/docs/referrals">Referrals</a>.{' '}
          <Todo>where the rest of the fee goes</Todo>
        </p>

        <H2>$CROSS holder discount</H2>
        <p>
          Holders of $CROSS get a discount once the token launches. See <a href="/docs/cross-token">$CROSS token</a>.
        </p>

        <H2>Network fees</H2>
        <p>
          Like any onchain action, posting, filling and cancelling cost a network fee, paid to {CHAIN.name}, not to Cross.{' '}
          <Todo>confirm the gas token</Todo>
        </p>
      </>
    ),
  },
  {
    slug: 'referrals',
    body: () => (
      <>
        <H2>How it works</H2>
        <p>
          When someone you referred trades, you get 20% of the settlement fee. With the fee at 0.5%, that's 0.1% of the trade's notional.
        </p>
        <p>
          It's paid in ETH, straight from the contract, in the same transaction that settles the trade. Both the buyer's referrer and the
          seller's referrer get paid.
        </p>
        <p>You register once, and it counts on the order book and on the OTC desk.</p>

        <H2>Get your link</H2>
        <ol>
          <li>
            Open <Ext href={`${APP}/referrals`}>Referrals</Ext> in the app.
          </li>
          <li>Connect your wallet.</li>
          <li>Copy your link and share it.</li>
        </ol>
        <p>
          <Todo>explain how a referral gets recorded: by opening the link, or by entering it under "Who referred you"</Todo>
        </p>
      </>
    ),
  },
  {
    slug: 'token-trust',
    body: () => (
      <>
        <H2>Anyone can list any token</H2>
        <p>
          Cross doesn't vet what people list. That's what "any token" means. So before you trade, check the token. The{' '}
          <Ext href={`${APP}/trust`}>Trust</Ext> tab does it for you, and the same checks show on the order form.
        </p>
        <Callout tone="warn" title="Check the address, not the ticker">
          Anyone can make a token called NVDA. A matching ticker with a different address is a different token.
        </Callout>

        <H2>The five checks</H2>
        <p>
          Stock tokens are checked against Robinhood's onchain asset registry and their Chainlink feeds. Each check shows a dot and a short
          line of detail.
        </p>
        <ol>
          <li>
            <strong>Canonical Robinhood stock token.</strong> The address matches Robinhood's registry, and the registry says the token is
            active.
          </li>
          <li>
            <strong>Allowlisted on the OTC desk.</strong> The OTC escrow contract accepts it.
          </li>
          <li>
            <strong>Chainlink feed fresh.</strong> When the price feed last updated, against its 24-hour heartbeat.
          </li>
          <li>
            <strong>Token not paused.</strong> Transfers are live.
          </li>
          <li>
            <strong>No pending corporate action.</strong> Shows the token's current multiplier, in shares per token.
          </li>
        </ol>
        <p>Every token card links to its address on Blockscout.</p>

        <H2>Other tokens</H2>
        <p>
          For tokens that aren't Robinhood stock tokens, Cross shows what it can read from the token's contract and its pools. It can't tell
          you a token is good. It can tell you what's there.
        </p>
        <p>The operator also keeps a token blocklist.</p>
      </>
    ),
  },
  {
    slug: 'cross-token',
    body: () => (
      <>
        <Callout title="Not live yet">
          <Todo>$CROSS details: launch, contract address, supply, where to get it</Todo>
        </Callout>

        <H2>Holder discount</H2>
        <p>
          Holders of $CROSS get a discount on the trading fee once the token launches. The exact rates are set onchain and shown on every
          ticket before you confirm. <Todo>discount rates and how holdings are counted</Todo>
        </p>

        <Callout tone="warn" title="Watch for fakes">
          Until the official contract address is published here and in the app, treat any token called CROSS as unverified.
        </Callout>
      </>
    ),
  },
  {
    slug: 'security',
    body: () => (
      <>
        <H2>Per-order caps</H2>
        <p>
          Until the audit is done, each order and each OTC deal is capped at 2 ETH. The cap is enforced onchain, by the contracts themselves.
          An independent review is planned before it's lifted.
        </p>

        <H2>Testing</H2>
        <p>Both contracts have full Foundry test suites, including fuzzing. That's internal testing, not an audit.</p>

        <H2>Audit</H2>
        <p>
          The audit is pending. An independent review is planned before the per-order caps are lifted. <Todo>auditor and report link, once
          available</Todo>
        </p>

        <H2>What the operator can and can't do</H2>
        <p>The operator can:</p>
        <ul>
          <li>pause new activity</li>
          <li>change the fee, up to the 2% hard cap</li>
          <li>set the per-order caps</li>
          <li>manage the token blocklist</li>
        </ul>
        <p>
          The operator can't move tokens or ETH held in escrow. Unfilled orders and unmatched OTC deposits can be withdrawn by you, and only
          you.
        </p>

        <H2>Stay safe</H2>
        <ul>
          <li>
            Use the app at <Ext href={APP}>app.usecrossp2p.com</Ext>.
          </li>
          <li>
            Check you're dealing with the real contracts. Their addresses are on <a href="/docs/contracts">Contracts</a>.
          </li>
          <li>Check every token's address before you trade it.</li>
        </ul>
        <p>
          <Todo>how to report a bug or vulnerability</Todo>
        </p>
      </>
    ),
  },
  {
    slug: 'contracts',
    body: () => (
      <>
        <H2>Addresses</H2>
        <div className="docs-table">
          <table>
            <thead>
              <tr>
                <th>Contract</th>
                <th>Address</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Exchange</td>
                <td>
                  <Address address={CONTRACTS.exchange} />
                </td>
              </tr>
              <tr>
                <td>OTC escrow</td>
                <td>
                  <Address address={CONTRACTS.otc} />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>Each address links to Blockscout, {CHAIN.name}'s block explorer.</p>

        <H2>What each one does</H2>
        <ul>
          <li>
            <strong>Exchange.</strong> Holds orders from the Board in escrow and swaps both sides when a buyer fills.
          </li>
          <li>
            <strong>OTC escrow.</strong> Holds both sides of an OTC deal and swaps them when the second side pays in.
          </li>
        </ul>
        <Callout tone="warn">
          If an app or a person asks you to approve tokens for a contract that isn't listed here, in Cross's name, stop and check.
        </Callout>
      </>
    ),
  },
  {
    slug: 'faq',
    body: () => (
      <>
        <H2>Is there really no slippage?</H2>
        <p>
          Yes. The price is fixed in the order before anyone fills it. You pay exactly that price plus the 0.5% fee. No pool sits in between to
          move it.
        </p>

        <H2>Who pays the fee?</H2>
        <p>The buyer, 0.5% on top of the price. Sellers get their full price.</p>

        <H2>Can I sell any token?</H2>
        <p>
          Any {CHAIN.name} ERC-20. Paste its address on the order form. Buyers will see its trust checks, so expect them to look closely at
          tokens they don't know.
        </p>

        <H2>What if my order doesn't fill?</H2>
        <p>
          It stays on the Board until it expires or you cancel it. You can cancel any time and get back whatever hasn't filled.
        </p>

        <H2>Can Cross take my tokens?</H2>
        <p>
          No. Tokens in escrow can only go to a buyer who pays, or back to you. The operator can pause new activity, but can't move escrowed
          funds. See <a href="/docs/security">Security</a>.
        </p>

        <H2>How big can an order be?</H2>
        <p>Up to 2 ETH per order or OTC deal, until the audit is done.</p>

        <H2>Is Cross audited?</H2>
        <p>
          Not yet. Both contracts are internally tested with Foundry, including fuzzing. An independent review is planned before the caps are
          lifted.
        </p>

        <H2>When should I use the OTC desk instead of an order?</H2>
        <p>
          Use an order for everyday trades in any token. Use the OTC desk for a big block in NVDA, AAPL or TSLA where you want to agree a price
          with one counterparty first.
        </p>
      </>
    ),
  },
]

/** Every page in sidebar order: its metadata plus its body. */
export const PAGES: DocPage[] = DOC_META.map((meta) => {
  const entry = BODIES.find((b) => b.slug === meta.slug)
  if (!entry) throw new Error(`docs: no body for "${meta.slug}"`)
  return { ...meta, body: entry.body }
})

/** Page for a pathname like /docs or /docs/trading/fill, or undefined. */
export const findPage = (path: string) => {
  const slug = path.replace(/^\/docs\/?/, '').replace(/\/$/, '')
  return PAGES.find((p) => p.slug === slug)
}
