import { GitbookIcon, MediumIcon, TwitterIcon } from '~/assets/icons/SocialIcon';
import { ChromaticLogo } from '~/assets/icons/Logo';
import { Button } from '../../atom/Button';

export const Footer = () => (
  <footer>
    <div className="flex flex-col items-center gap-4 pt-6 pb-8 text-center bg-primary dark:bg-paper-lightest/60 dark:border-t">
      <a
        href="https://chromatic.finance/"
        target="_blank"
        rel="noopener noreferrer"
        title="Chromatic"
      >
        <ChromaticLogo className="text-inverted dark:text-primary" />
      </a>
      <p className="text-inverted-lighter dark:text-primary-lighter">
        A New Era in Decentralized Perpetual Futures
      </p>
      <div className="flex items-center gap-2">
        <Button
          href="https://twitter.com/chromatic_perp"
          css="light"
          size="lg"
          className="!bg-transparent !border-inverted-lighter !text-inverted dark:!border-primary-lighter dark:!text-primary"
          iconOnly={<TwitterIcon />}
        />
        <Button
          href="https://medium.com/@chromatic-protocol"
          css="light"
          size="lg"
          className="!bg-transparent !border-inverted-lighter !text-inverted dark:!border-primary-lighter dark:!text-primary"
          iconOnly={<MediumIcon />}
        />
        <Button
          href="https://chromatic.gitbook.io/docs"
          css="light"
          size="lg"
          className="!bg-transparent !border-inverted-lighter !text-inverted dark:!border-primary-lighter dark:!text-primary"
          iconOnly={<GitbookIcon />}
        />
      </div>
    </div>
  </footer>
);
