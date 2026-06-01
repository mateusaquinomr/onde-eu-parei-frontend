import { Text } from '@/shared/components/ui/Text/Text';
import { SocialIcon } from 'react-custom-social-icons';
import styles from './SocialButtons.module.css';

interface SocialButtonsProps {
    disabled?: boolean;
}

export function SocialButtons({ disabled = true }: SocialButtonsProps) {
    const handleClick = (provider: string) => {
        if (disabled) {
            console.log(`${provider} - em desenvolvimento`);
            return;
        }

    };

    return (
        <div className={styles.container}>
            <div className={styles.divider}>
                <span className={styles.dividerLine} />
                <Text variant="caption" className={styles.dividerText}>ou</Text>
                <span className={styles.dividerLine} />
            </div>

            <div className={styles.buttons}>
                <button
                    className={styles.socialButton}
                    onClick={() => handleClick('google')}
                    disabled={disabled}
                >
                    <SocialIcon
                        network="google"
                        size={18}
                    />
                    <Text variant="caption">Google</Text>
                </button>
                <button
                    className={styles.socialButton}
                    onClick={() => handleClick('facebook')}
                    disabled={disabled}
                >
                    <SocialIcon
                        network="facebook"
                        size={18}
                    />
                    <Text variant="caption">Facebook</Text>
                </button>
                <button
                    className={styles.socialButton}
                    onClick={() => handleClick('twitter')}
                    disabled={disabled}
                >
                    <SocialIcon
                        network="twitter"
                        size={18}
                    />
                    <Text variant="caption">Twitter</Text>
                </button>
            </div>
        </div>
    );
}